from fastapi import APIRouter, UploadFile, File
from app.services.basket_service import process_uploaded_data

router = APIRouter()

@router.post("/dataset")
async def upload_dataset(file: UploadFile = File(...)):
    # Process the file
    result = await process_uploaded_data(file)
    return result