from app.services.analysis_service import train_from_csv_bytes

async def process_uploaded_data(file):
    content = await file.read()
    artifact = train_from_csv_bytes(content, dataset_name=file.filename or "uploaded_dataset.csv")
    return {
        "message": "Dataset uploaded and model trained successfully",
        "dataset_name": artifact["dataset_name"],
        "transactions_count": artifact["total_transactions"],
        "products_count": artifact["total_products"],
        "association_rules": artifact["association_rules"],
        "trained_at": artifact["trained_at"],
    }
