# Architecture

## Overview
This project implements market basket analysis using association rule mining to find relationships between products in transaction data.

## Components

### Backend (FastAPI)
- **API Routes**: Health check, dataset upload, recommendation generation
- **ML Models**: Apriori and FP-Growth algorithms for frequent itemset mining
- **Services**: Business logic for data processing and recommendations
- **Schemas**: Pydantic models for request/response validation
- **Utils**: Data preprocessing and rule filtering utilities
- **Database**: Optional SQLAlchemy setup for transaction storage

### Frontend (React)
- **Components**: Reusable UI elements (Navbar, Upload, Product Selector, Recommendation List)
- **Pages**: Home, Dashboard (upload), Recommendations (interactive selection)
- **Services**: Axios-based API client
- **Styling**: Basic CSS for layout

### Notebooks
- Exploratory data analysis and model experimentation

### Datasets
- Sample transaction data in CSV format

### Trained Models
- Serialized ML models for production use

## Workflow
1. Upload transaction dataset via frontend
2. Backend preprocesses data and trains models
3. User selects products in basket
4. Backend generates recommendations using trained models
5. Frontend displays recommendations