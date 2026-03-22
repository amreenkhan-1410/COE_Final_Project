from __future__ import annotations

from collections import Counter
from datetime import UTC, datetime
from io import BytesIO
import os
from pathlib import Path
from typing import Any

import joblib
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[2]
DATASETS_DIR = BASE_DIR / "datasets"
MODELS_DIR = BASE_DIR / "trained_models"
DEFAULT_DATASET_PATH = DATASETS_DIR / "processed_transactions.csv"
UPLOADED_DATASET_PATH = DATASETS_DIR / "uploaded_dataset.csv"
ARTIFACT_PATH = MODELS_DIR / "association_rules.joblib"
ARTIFACT_VERSION = 3

RULE_COLUMNS = ["antecedents", "consequents", "support", "confidence", "lift"]
ID_COLUMN_HINTS = ("id", "transaction", "invoice", "order", "customer")
TRUTHY_VALUES = {"1", "true", "yes", "y", "t"}
FALSY_VALUES = {"0", "false", "no", "n", "f", ""}
TRAINING_PROFILES = [
    (0.005, 0.1),
    (0.003, 0.08),
    (0.002, 0.05),
    (0.0015, 0.03),
]
TARGET_RULE_COUNT = 60
TARGET_PATTERN_COUNT = 120
MAX_ITEMSET_SIZE = 3
MAX_STORED_RULES = 320
MAX_STORED_PATTERNS = 320


def _clean_item(value: Any) -> str | None:
    if pd.isna(value):
        return None

    text = str(value).strip()
    if not text or text.lower() in {"nan", "none", "null"}:
        return None
    return text


def _looks_like_id_column(column_name: str) -> bool:
    lowered = column_name.strip().lower()
    return any(hint in lowered for hint in ID_COLUMN_HINTS)


def _normalize_binary_value(value: Any) -> bool | None:
    if pd.isna(value):
        return False

    if isinstance(value, bool):
        return value

    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if value == 1:
            return True
        if value == 0:
            return False
        return None

    text = str(value).strip().lower()
    if text in TRUTHY_VALUES:
        return True
    if text in FALSY_VALUES:
        return False
    return None


def _get_item_columns(df: pd.DataFrame) -> list[str]:
    return [column for column in df.columns if not _looks_like_id_column(column)]


def _is_one_hot_encoded(df: pd.DataFrame, item_columns: list[str]) -> bool:
    if not item_columns:
        return False

    binary_like_columns = 0
    for column in item_columns:
        unique_values = df[column].dropna().unique()
        if len(unique_values) == 0:
            continue

        normalized_values = {_normalize_binary_value(value) for value in unique_values}
        if None in normalized_values:
            return False
        binary_like_columns += 1

    return binary_like_columns > 0


def dataframe_to_transactions(df: pd.DataFrame) -> list[list[str]]:
    if df.empty:
        return []

    if len(df.columns) == 1:
        series = df.iloc[:, 0].dropna().astype(str)
        transactions = []
        for raw_value in series:
            normalized = raw_value.replace("|", ",").replace(";", ",")
            items = [_clean_item(item) for item in normalized.split(",")]
            cleaned = sorted({item for item in items if item})
            if cleaned:
                transactions.append(cleaned)
        return transactions

    item_columns = _get_item_columns(df)
    if _is_one_hot_encoded(df, item_columns):
        transactions = []
        for _, row in df[item_columns].iterrows():
            items = [
                column
                for column in item_columns
                if _normalize_binary_value(row[column]) is True
            ]
            cleaned = sorted({item for item in items if item})
            if cleaned:
                transactions.append(cleaned)
        return transactions

    candidate_columns = []
    for column in item_columns:
        if pd.api.types.is_object_dtype(df[column]) or pd.api.types.is_string_dtype(df[column]):
            candidate_columns.append(column)

    if not candidate_columns:
        candidate_columns = item_columns

    transactions = []
    for _, row in df[candidate_columns].iterrows():
        items = [_clean_item(value) for value in row.tolist()]
        cleaned = sorted({item for item in items if item})
        if cleaned:
            transactions.append(cleaned)

    return transactions


def _empty_rules_frame() -> pd.DataFrame:
    return pd.DataFrame(columns=RULE_COLUMNS)


def _empty_patterns_frame() -> pd.DataFrame:
    return pd.DataFrame(columns=["itemsets", "support"])


def _get_path_modified_at(path: Path) -> float | None:
    if not path.exists():
        return None
    return path.stat().st_mtime


def _encode_transactions(transactions: list[list[str]]) -> pd.DataFrame:
    encoder = TransactionEncoder()
    encoded = encoder.fit(transactions).transform(transactions)
    return pd.DataFrame(encoded, columns=encoder.columns_)


def _mine_patterns(
    transactions: list[list[str]],
) -> tuple[pd.DataFrame, pd.DataFrame, float, float]:
    basket_matrix = _encode_transactions(transactions)
    best_rules = _empty_rules_frame()
    best_patterns = _empty_patterns_frame()
    best_profile = TRAINING_PROFILES[-1]
    best_score = -1

    for min_support, min_confidence in TRAINING_PROFILES:
        all_itemsets = apriori(
            basket_matrix,
            min_support=min_support,
            use_colnames=True,
            max_len=MAX_ITEMSET_SIZE,
        )
        if all_itemsets.empty:
            continue

        patterns = all_itemsets[all_itemsets["itemsets"].map(len) >= 2].copy()
        if patterns.empty:
            continue

        rules = association_rules(
            all_itemsets,
            metric="confidence",
            min_threshold=min_confidence,
        )
        if rules.empty:
            rules = _empty_rules_frame()
        else:
            rules = rules.loc[:, RULE_COLUMNS].copy()

        patterns.sort_values(["support"], ascending=False, inplace=True)
        rules.sort_values(["confidence", "lift", "support"], ascending=False, inplace=True)

        quality_score = len(rules.index) * 3 + len(patterns.index)
        if quality_score > best_score:
            best_score = quality_score
            best_rules = rules
            best_patterns = patterns
            best_profile = (min_support, min_confidence)

        if len(rules.index) >= TARGET_RULE_COUNT or len(patterns.index) >= TARGET_PATTERN_COUNT:
            return rules, patterns, min_support, min_confidence

    return best_rules, best_patterns, best_profile[0], best_profile[1]


def _format_percentage(value: float) -> str:
    return f"{round(value * 100, 1)}%"


def _rules_to_records(rules: pd.DataFrame) -> list[dict[str, Any]]:
    if rules.empty:
        return []

    records = []
    limited_rules = rules.head(MAX_STORED_RULES)
    for _, row in limited_rules.iterrows():
        antecedents = sorted(str(item) for item in row["antecedents"])
        consequents = sorted(str(item) for item in row["consequents"])
        records.append(
            {
                "antecedents": antecedents,
                "antecedents_label": ", ".join(antecedents),
                "consequents": consequents,
                "consequents_label": ", ".join(consequents),
                "support": round(float(row["support"]), 4),
                "confidence": round(float(row["confidence"]), 4),
                "lift": round(float(row["lift"]), 4),
            }
        )

    return records


def _patterns_to_records(patterns: pd.DataFrame, total_transactions: int) -> list[dict[str, Any]]:
    if patterns.empty:
        return []

    records = []
    limited_patterns = patterns.sort_values(["support"], ascending=False).head(MAX_STORED_PATTERNS)
    for _, row in limited_patterns.iterrows():
        items = sorted(str(item) for item in row["itemsets"])
        records.append(
            {
                "items": items,
                "label": " + ".join(items),
                "size": len(items),
                "support": round(float(row["support"]), 4),
                "frequency": int(round(float(row["support"]) * total_transactions)),
            }
        )

    records.sort(key=lambda pattern: (pattern["support"], pattern["size"], pattern["label"]), reverse=True)
    return records


def _build_basket_size_distribution(transactions: list[list[str]]) -> list[dict[str, Any]]:
    buckets = [
        ("1 item", lambda size: size == 1),
        ("2 items", lambda size: size == 2),
        ("3 items", lambda size: size == 3),
        ("4-5 items", lambda size: 4 <= size <= 5),
        ("6+ items", lambda size: size >= 6),
    ]
    sizes = [len(transaction) for transaction in transactions]
    distribution = []
    for label, matcher in buckets:
        count = sum(1 for size in sizes if matcher(size))
        distribution.append({"label": label, "count": count})
    return distribution


def _build_top_products(
    product_counts: Counter[str],
    total_transactions: int,
) -> list[dict[str, Any]]:
    top_products = []
    for item, count in product_counts.most_common(12):
        share = count / total_transactions if total_transactions else 0
        top_products.append(
            {
                "name": item,
                "frequency": count,
                "share": round(share, 4),
                "share_label": _format_percentage(share),
            }
        )
    return top_products


def _build_top_pairings(patterns: list[dict[str, Any]]) -> list[dict[str, Any]]:
    pairings = [pattern for pattern in patterns if pattern["size"] == 2][:8]
    enriched = []
    for pairing in pairings:
        enriched.append(
            {
                **pairing,
                "items_label": pairing["label"],
                "share_label": _format_percentage(pairing["support"]),
            }
        )
    return enriched


def _build_highlights(
    total_products: int,
    total_transactions: int,
    average_basket_size: float,
    top_products: list[dict[str, Any]],
    top_pairings: list[dict[str, Any]],
    total_relationships: int,
) -> list[dict[str, str]]:
    leading_product = top_products[0] if top_products else None
    leading_pairing = top_pairings[0] if top_pairings else None

    highlights = [
        {
            "title": "Catalog variety",
            "value": str(total_products),
            "description": "distinct products available for basket discovery",
        },
        {
            "title": "Shopping sessions",
            "value": f"{total_transactions:,}",
            "description": "transactions shaping the recommendation experience",
        },
        {
            "title": "Typical basket",
            "value": f"{average_basket_size:.1f} items",
            "description": "average basket size across the full dataset",
        },
        {
            "title": "Connection depth",
            "value": str(total_relationships),
            "description": "learned product relationships ready for recommendations",
        },
    ]

    if leading_product:
        highlights.append(
            {
                "title": "Top product signal",
                "value": leading_product["name"],
                "description": f"appears in {leading_product['share_label']} of baskets",
            }
        )

    if leading_pairing:
        highlights.append(
            {
                "title": "Popular pairing",
                "value": leading_pairing["items_label"],
                "description": f"appears together in {leading_pairing['share_label']} of baskets",
            }
        )

    return highlights


def _build_artifact(
    transactions: list[list[str]],
    dataset_name: str,
    source_path: str | None = None,
) -> dict[str, Any]:
    if not transactions:
        raise ValueError("No transactions could be extracted from the dataset.")

    rules, patterns, min_support, min_confidence = _mine_patterns(transactions)

    total_transactions = len(transactions)
    product_counts = Counter(item for transaction in transactions for item in transaction)
    products = sorted(product_counts)
    top_products = _build_top_products(product_counts, total_transactions)
    pattern_records = _patterns_to_records(patterns, total_transactions)
    top_pairings = _build_top_pairings(pattern_records)
    basket_sizes = [len(transaction) for transaction in transactions]
    average_basket_size = sum(basket_sizes) / total_transactions if total_transactions else 0
    total_relationships = len(pattern_records) + len(rules.index)

    return {
        "artifact_version": ARTIFACT_VERSION,
        "dataset_name": dataset_name,
        "source_path": source_path,
        "source_modified_at": _get_path_modified_at(Path(source_path)) if source_path else None,
        "trained_at": datetime.now(UTC).isoformat(),
        "min_support": min_support,
        "min_confidence": min_confidence,
        "total_transactions": total_transactions,
        "total_products": len(products),
        "average_basket_size": round(average_basket_size, 2),
        "association_rules": len(rules.index),
        "relationship_patterns": len(pattern_records),
        "products": products,
        "top_products": top_products,
        "top_pairings": top_pairings,
        "basket_size_distribution": _build_basket_size_distribution(transactions),
        "highlights": _build_highlights(
            total_products=len(products),
            total_transactions=total_transactions,
            average_basket_size=average_basket_size,
            top_products=top_products,
            top_pairings=top_pairings,
            total_relationships=total_relationships,
        ),
        "rules": _rules_to_records(rules),
        "patterns": pattern_records,
    }


def _persist_artifact(artifact: dict[str, Any]) -> dict[str, Any]:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(artifact, ARTIFACT_PATH)
    return artifact


def _resolve_dataset_path() -> Path:
    configured_dataset = os.getenv("MARKET_BASKET_DATASET_PATH")
    if configured_dataset:
        configured_path = Path(configured_dataset).expanduser()
        if not configured_path.is_absolute():
            configured_path = (BASE_DIR / configured_path).resolve()
        if configured_path.exists():
            return configured_path
        raise FileNotFoundError(f"Configured dataset path does not exist: {configured_path}")

    if DEFAULT_DATASET_PATH.exists():
        return DEFAULT_DATASET_PATH

    raise FileNotFoundError(
        "No dataset found. Add the training CSV at backend/datasets/processed_transactions.csv "
        "or set MARKET_BASKET_DATASET_PATH."
    )


def _artifact_is_invalid(artifact: dict[str, Any]) -> bool:
    products = artifact.get("products", [])
    if not products:
        return False

    string_products = {str(product).strip() for product in products}
    return string_products.issubset({"0", "1"})


def _artifact_matches_dataset(artifact: dict[str, Any], dataset_path: Path) -> bool:
    artifact_source_path = artifact.get("source_path")
    if artifact_source_path != str(dataset_path):
        return False
    return artifact.get("source_modified_at") == _get_path_modified_at(dataset_path)


def load_artifact() -> dict[str, Any] | None:
    if not ARTIFACT_PATH.exists():
        return None

    try:
        artifact = joblib.load(ARTIFACT_PATH)
    except Exception:
        return None

    required_keys = {
        "artifact_version",
        "dataset_name",
        "trained_at",
        "total_transactions",
        "total_products",
        "association_rules",
        "products",
        "top_products",
        "rules",
        "patterns",
    }
    if not isinstance(artifact, dict) or not required_keys.issubset(artifact):
        return None
    if artifact.get("artifact_version") != ARTIFACT_VERSION:
        return None
    if _artifact_is_invalid(artifact):
        return None
    return artifact


def train_from_dataframe(
    df: pd.DataFrame,
    dataset_name: str,
    source_path: str | None = None,
) -> dict[str, Any]:
    artifact = _build_artifact(
        dataframe_to_transactions(df),
        dataset_name=dataset_name,
        source_path=source_path,
    )
    return _persist_artifact(artifact)


def train_from_csv_bytes(content: bytes, dataset_name: str) -> dict[str, Any]:
    DATASETS_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADED_DATASET_PATH.write_bytes(content)
    df = pd.read_csv(BytesIO(content))
    return train_from_dataframe(
        df,
        dataset_name=dataset_name,
        source_path=str(UPLOADED_DATASET_PATH),
    )


def _train_from_path(path: Path, dataset_name: str | None = None) -> dict[str, Any]:
    df = pd.read_csv(path)
    return train_from_dataframe(df, dataset_name=dataset_name or path.name, source_path=str(path))


def ensure_artifact() -> dict[str, Any]:
    preferred_dataset_path = _resolve_dataset_path()
    artifact = load_artifact()
    if artifact is not None and _artifact_matches_dataset(artifact, preferred_dataset_path):
        return artifact

    return _train_from_path(preferred_dataset_path)


def get_analytics() -> dict[str, Any]:
    artifact = ensure_artifact()
    return {
        "dataset_name": artifact["dataset_name"],
        "trained_at": artifact["trained_at"],
        "total_products": artifact["total_products"],
        "total_transactions": artifact["total_transactions"],
        "average_basket_size": artifact["average_basket_size"],
        "association_rules": artifact["association_rules"],
        "relationship_patterns": artifact["relationship_patterns"],
        "products": artifact["products"],
        "highlights": artifact["highlights"],
        "top_products": artifact["top_products"],
        "top_pairings": artifact["top_pairings"],
        "basket_size_distribution": artifact["basket_size_distribution"],
        "rules": artifact["rules"][:40],
        "patterns": artifact["patterns"][:40],
    }


def _build_strength_label(score: float) -> str:
    if score >= 4.5:
        return "Strong match"
    if score >= 3.2:
        return "High relevance"
    if score >= 2.2:
        return "Popular pairing"
    return "Worth a look"


def _build_reason(related_items: set[str], mode: str) -> str:
    related = sorted(related_items)
    if not related:
        return "Often added alongside similar baskets."

    if len(related) == 1:
        prefix = "Often chosen with" if mode == "rule" else "Common companion for"
        return f"{prefix} {related[0]}."

    if len(related) == 2:
        connector = "and"
        prefix = "Frequently appears with" if mode == "rule" else "Often added alongside"
        return f"{prefix} {related[0]} {connector} {related[1]}."

    prefix = "Common add-on for"
    return f"{prefix} {', '.join(related[:-1])}, and {related[-1]}."


def recommend_products(basket: list[str], limit: int = 6) -> list[dict[str, Any]]:
    artifact = ensure_artifact()
    normalized_basket = {item.strip() for item in basket if item and item.strip()}
    if not normalized_basket:
        return []

    candidates: dict[str, dict[str, Any]] = {}

    for rule in artifact["rules"]:
        antecedents = set(rule["antecedents"])
        overlap = normalized_basket & antecedents
        if not overlap:
            continue

        overlap_ratio = len(overlap) / len(antecedents)
        basket_coverage = len(overlap) / len(normalized_basket)
        exact_match_bonus = 0.45 if antecedents.issubset(normalized_basket) else 0

        for item in rule["consequents"]:
            if item in normalized_basket:
                continue

            score = (
                rule["confidence"] * 2.6
                + rule["lift"] * 0.9
                + rule["support"] * 5.5
                + overlap_ratio * 1.5
                + basket_coverage * 0.8
                + exact_match_bonus
            )
            existing = candidates.get(item)
            candidate = {
                "name": item,
                "reason": _build_reason(overlap, mode="rule"),
                "strength": _build_strength_label(score),
                "score": round(score, 4),
                "context_items": sorted(overlap),
            }
            if existing is None or candidate["score"] > existing["score"]:
                candidates[item] = candidate

    for pattern in artifact["patterns"]:
        items = set(pattern["items"])
        overlap = normalized_basket & items
        if not overlap or items.issubset(normalized_basket):
            continue

        overlap_ratio = len(overlap) / len(items)
        basket_coverage = len(overlap) / len(normalized_basket)

        for item in items - normalized_basket:
            score = (
                pattern["support"] * 6.5
                + overlap_ratio * 1.8
                + basket_coverage * 1.1
                + pattern["size"] * 0.15
            )
            existing = candidates.get(item)
            candidate = {
                "name": item,
                "reason": _build_reason(overlap, mode="pattern"),
                "strength": _build_strength_label(score),
                "score": round(score, 4),
                "context_items": sorted(overlap),
            }
            if existing is None or candidate["score"] > existing["score"]:
                candidates[item] = candidate

    ranked = sorted(
        candidates.values(),
        key=lambda candidate: (
            candidate["score"],
            len(candidate["context_items"]),
            candidate["name"],
        ),
        reverse=True,
    )

    return [
        {
            "name": candidate["name"],
            "reason": candidate["reason"],
            "strength": candidate["strength"],
            "context_items": candidate["context_items"],
        }
        for candidate in ranked[:limit]
    ]
