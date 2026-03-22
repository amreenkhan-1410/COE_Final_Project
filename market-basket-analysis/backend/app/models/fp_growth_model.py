from mlxtend.frequent_patterns import fpgrowth, association_rules
import pandas as pd

class FPGrowthModel:
    def __init__(self, min_support=0.01, min_confidence=0.2):
        self.min_support = min_support
        self.min_confidence = min_confidence
        self.rules = None

    def fit(self, transactions):
        from mlxtend.preprocessing import TransactionEncoder
        te = TransactionEncoder()
        te_ary = te.fit(transactions).transform(transactions)
        df = pd.DataFrame(te_ary, columns=te.columns_)
        frequent_itemsets = fpgrowth(df, min_support=self.min_support, use_colnames=True)
        self.rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=self.min_confidence)

    def predict(self, basket):
        recommendations = []
        for _, rule in self.rules.iterrows():
            if set(rule['antecedents']).issubset(set(basket)):
                recommendations.extend(list(rule['consequents'] - set(basket)))
        return list(set(recommendations))