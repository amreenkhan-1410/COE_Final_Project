# Meridian Market

Meridian Market is a full-stack retail recommendation application that learns product relationships from a backend transaction dataset and turns them into a polished shopping-assistant experience.

The backend handles dataset parsing, market basket analysis, analytics, and recommendation ranking. The frontend presents that logic as a premium, responsive product interface with a searchable catalog, basket builder, recommendation cards, and live shopping insights.

## What It Does

- Trains on a fixed backend dataset
- Extracts the live product catalog from that dataset
- Generates recommendations from learned basket relationships
- Adapts automatically when the dataset changes
- Surfaces market-friendly insights such as top products, common pairings, and basket mix

## Stack

- Backend: FastAPI, Pandas, MLxtend, Joblib
- Frontend: React, Vite, Tailwind CSS, Axios, Recharts

## Dataset

The application uses this dataset by default:

```text
backend/datasets/processed_transactions.csv
```

You can optionally override it in deployment with:

```text
MARKET_BASKET_DATASET_PATH=/absolute/path/to/your_dataset.csv
```

Supported dataset formats:

- One-hot encoded transaction tables with `0/1`, `true/false`, or similar values
- Basket-style rows with item columns
- Single-column rows containing comma-separated item lists

General expectation:

- Each row should represent one shopping basket or transaction
- Item names should be present as clean product labels or recoverable column names
- ID-like columns such as transaction IDs are ignored automatically when detected

## Recommendation Logic

Internally, the backend:

1. Loads and cleans the dataset
2. Converts rows into transactions
3. Mines frequent product relationships
4. Builds ranked recommendations from overlapping basket patterns
5. Returns business-friendly JSON to the frontend

The UI intentionally hides technical training details so the product feels like a finished recommendation platform rather than a machine learning demo.

## Project Structure

```text
market-basket-analysis/
├── backend/
│   ├── app/
│   ├── datasets/
│   ├── trained_models/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Backend URL:

```text
http://127.0.0.1:8000
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Frontend URL:

```text
http://127.0.0.1:5173
```

If needed, set the frontend API target with:

```text
VITE_API_URL=http://127.0.0.1:8000
```

## API Endpoints

- `GET /health/`
- `GET /analytics/`
- `POST /recommendation/`

## Notes

- The application retrains automatically when the configured dataset file changes.
- Recommendations only appear when the dataset supports a meaningful product relationship.
- A pandas `numexpr` warning may appear in some environments if the installed `numexpr` version is older than recommended. It does not block the app.
