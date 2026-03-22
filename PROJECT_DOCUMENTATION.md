# Market Basket Analysis Project - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Installation and Setup](#installation-and-setup)
5. [API Documentation](#api-documentation)
6. [Frontend Components](#frontend-components)
7. [Machine Learning Models](#machine-learning-models)
8. [Data Flow and Workflow](#data-flow-and-workflow)
9. [Usage Guide](#usage-guide)
10. [Configuration](#configuration)
11. [Troubleshooting](#troubleshooting)
12. [Contributing](#contributing)

## Project Overview

**Meridian Market** is a full-stack retail recommendation application that leverages market basket analysis to provide intelligent product recommendations. The system analyzes transaction data to discover product relationships and presents them through a modern, responsive web interface.

### Key Features
- **Automated Dataset Processing**: Handles various transaction data formats
- **Dual ML Algorithms**: Implements both Apriori and FP-Growth for association rule mining
- **Real-time Recommendations**: Dynamic product suggestions based on basket contents
- **Interactive Dashboard**: User-friendly interface for product selection and insights
- **Analytics Dashboard**: Market insights including top products and common pairings
- **Scalable Architecture**: Modular backend with FastAPI and React frontend

### Business Value
- Increases average order value through intelligent cross-selling
- Improves customer experience with personalized recommendations
- Provides actionable business insights from transaction data
- Reduces manual analysis time with automated pattern discovery

## Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   ML Models     │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (MLxtend)     │
│                 │    │                 │    │                 │
│ - Product       │    │ - REST Endpoints│    │ - Apriori       │
│   Selector      │    │ - Data          │    │ - FP-Growth     │
│ - Basket        │    │   Processing    │    │ - Association   │
│   Builder       │    │ - Model Training│    │   Rules         │
│ - Recommendations│    │ - Caching      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Datasets      │
                       │   (CSV/JSON)    │
                       └─────────────────┘
```

### Backend Architecture
```
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── analytics.py      # Market insights endpoints
│   │   │   ├── health.py         # Health check endpoints
│   │   │   ├── recommendation.py # Recommendation logic
│   │   │   └── upload.py         # Dataset upload handling
│   │   └── api_router.py         # Route aggregation
│   ├── models/
│   │   ├── apriori_model.py      # Apriori algorithm implementation
│   │   ├── fp_growth_model.py    # FP-Growth algorithm implementation
│   │   └── load_model.py         # Model loading utilities
│   ├── services/
│   │   ├── analysis_service.py   # Analytics business logic
│   │   ├── basket_service.py     # Basket processing
│   │   └── recommendation_service.py # Recommendation engine
│   ├── schemas/
│   │   ├── basket_schema.py      # Basket data models
│   │   └── recommendation_schema.py # Recommendation models
│   ├── utils/
│   │   ├── association_rules.py  # Rule mining utilities
│   │   └── data_preprocessing.py # Data cleaning and prep
│   ├── database/                 # Optional database layer
│   └── config.py                 # Application configuration
├── datasets/                     # Sample and uploaded datasets
├── trained_models/               # Serialized ML models
└── requirements.txt              # Python dependencies
```

### Frontend Architecture
```
frontend/
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── BasketSelector.jsx    # Basket management
│   │   ├── ProductCard.jsx       # Product display
│   │   ├── RecommendationCard.jsx # Recommendation display
│   │   └── StatsCard.jsx         # Analytics widgets
│   ├── pages/                    # Page components
│   │   ├── Home.jsx              # Landing page
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   └── RecommendationPage.jsx # Recommendation interface
│   ├── services/                 # API client
│   │   └── api.js                # Axios configuration
│   └── styles/                   # Styling
├── public/                       # Static assets
└── package.json                  # Node dependencies
```

## Technology Stack

### Backend
- **Framework**: FastAPI - High-performance async web framework
- **ML Libraries**:
  - MLxtend - Association rule mining algorithms
  - Pandas - Data manipulation and analysis
  - Scikit-learn - Additional ML utilities
- **Serialization**: Joblib - Model persistence
- **Data Processing**: NumPy - Numerical computing
- **API Documentation**: Automatic OpenAPI/Swagger generation

### Frontend
- **Framework**: React 18 - Component-based UI library
- **Build Tool**: Vite - Fast development server and bundler
- **Styling**: Tailwind CSS - Utility-first CSS framework
- **HTTP Client**: Axios - Promise-based HTTP client
- **Routing**: React Router - Client-side routing
- **Icons**: Lucide React - Beautiful icon library
- **Charts**: Recharts - Composable charting library

### Development Tools
- **Version Control**: Git
- **Environment**: Python virtualenv
- **Package Management**: pip (Python), npm (Node.js)
- **Code Quality**: ESLint, Prettier
- **Testing**: pytest (Python), Jest (JavaScript)

## Installation and Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Backend Setup

1. **Clone and Navigate**:
   ```bash
   git clone <repository-url>
   cd market-basket-analysis/backend
   ```

2. **Create Virtual Environment**:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Development Server**:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

5. **Verify Installation**:
   - Open http://127.0.0.1:8000/docs for API documentation
   - Check http://127.0.0.1:8000/health/ for health status

### Frontend Setup

1. **Navigate to Frontend Directory**:
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure API URL** (optional):
   ```bash
   # Create .env file
   echo "VITE_API_URL=http://127.0.0.1:8000" > .env
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Access Application**:
   - Frontend: http://127.0.0.1:5173
   - API Docs: http://127.0.0.1:8000/docs

### Production Deployment

1. **Backend Production**:
   ```bash
   # Using gunicorn
   pip install gunicorn
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

2. **Frontend Production**:
   ```bash
   npm run build
   npm run preview  # For testing build
   # Deploy dist/ folder to web server
   ```

## API Documentation

### Base URL
```
http://127.0.0.1:8000
```

### Endpoints

#### Health Check
- **GET** `/health/`
- **Description**: Service health status
- **Response**: `{"status": "healthy"}`

#### Analytics
- **GET** `/analytics/`
- **Description**: Market insights and statistics
- **Response**:
  ```json
  {
    "total_transactions": 1234,
    "total_products": 56,
    "top_products": ["Product A", "Product B"],
    "avg_basket_size": 3.2,
    "common_pairings": [
      {"items": ["Milk", "Bread"], "support": 0.15}
    ]
  }
  ```

#### Recommendations
- **POST** `/recommendation/`
- **Description**: Generate product recommendations
- **Request Body**:
  ```json
  {
    "basket": ["Milk", "Bread"],
    "max_recommendations": 5
  }
  ```
- **Response**:
  ```json
  {
    "recommendations": [
      {
        "product": "Butter",
        "confidence": 0.85,
        "support": 0.12,
        "lift": 1.3
      }
    ]
  }
  ```

## Frontend Components

### Core Components

#### ProductSelector
- **Purpose**: Product search and selection interface
- **Features**: Autocomplete search, category filtering
- **Props**: `onProductSelect`, `selectedProducts`

#### BasketSelector
- **Purpose**: Current basket management
- **Features**: Add/remove products, quantity adjustment
- **State**: Local storage persistence

#### RecommendationList
- **Purpose**: Display recommended products
- **Features**: Confidence scores, add to basket
- **Data Source**: API `/recommendation/` endpoint

#### StatsCard
- **Purpose**: Analytics visualization
- **Features**: Charts for top products, basket insights
- **Library**: Recharts for data visualization

### Page Components

#### Home Page
- **Route**: `/`
- **Content**: Application overview, navigation

#### Dashboard
- **Route**: `/dashboard`
- **Content**: Product selection, basket building, recommendations

#### Insights
- **Route**: `/insights`
- **Content**: Market analytics, trends, patterns

## Machine Learning Models

### Apriori Algorithm
- **Purpose**: Frequent itemset mining
- **Parameters**:
  - `min_support`: Minimum support threshold (default: 0.01)
  - `min_confidence`: Minimum confidence threshold (default: 0.2)
- **Advantages**: Simple, interpretable
- **Limitations**: Can be slow on large datasets

### FP-Growth Algorithm
- **Purpose**: Efficient frequent itemset mining
- **Parameters**: Same as Apriori
- **Advantages**: Faster than Apriori, handles large datasets
- **Limitations**: More complex implementation

### Association Rules
- **Metrics**:
  - **Support**: Frequency of itemset occurrence
  - **Confidence**: Likelihood of consequent given antecedent
  - **Lift**: Improvement over random co-occurrence
- **Usage**: Rule-based recommendations

## Data Flow and Workflow

### Data Ingestion
1. **Upload**: CSV file via frontend or direct file placement
2. **Validation**: Format checking and data quality assessment
3. **Preprocessing**: Cleaning, normalization, transaction extraction

### Model Training
1. **Data Preparation**: Convert to transaction list format
2. **Algorithm Selection**: Choose between Apriori/FP-Growth
3. **Parameter Tuning**: Adjust support/confidence thresholds
4. **Rule Generation**: Extract meaningful association rules
5. **Model Serialization**: Save trained model for inference

### Recommendation Generation
1. **Basket Analysis**: Extract products from user basket
2. **Rule Matching**: Find applicable association rules
3. **Scoring**: Rank recommendations by confidence/lift
4. **Filtering**: Remove already selected products
5. **Response**: Return top N recommendations

### Analytics Processing
1. **Data Aggregation**: Compute market statistics
2. **Pattern Discovery**: Identify top products and pairings
3. **Visualization**: Prepare data for frontend charts
4. **Caching**: Store results for performance

## Usage Guide

### For End Users

1. **Access Application**: Open http://127.0.0.1:5173
2. **Browse Products**: Use search or browse catalog
3. **Build Basket**: Add products to your shopping basket
4. **Get Recommendations**: View personalized suggestions
5. **Explore Insights**: Check market analytics and trends

### For Developers

1. **API Testing**: Use `/docs` endpoint for interactive testing
2. **Model Training**: Run notebooks for algorithm experimentation
3. **Data Upload**: Place CSV files in `backend/datasets/`
4. **Configuration**: Modify `app/config.py` for custom settings

### For Data Scientists

1. **Data Exploration**: Use provided notebooks
2. **Algorithm Comparison**: Compare Apriori vs FP-Growth performance
3. **Parameter Tuning**: Experiment with different thresholds
4. **Custom Models**: Extend existing model classes

## Configuration

### Environment Variables

#### Backend
```bash
MARKET_BASKET_DATASET_PATH=/path/to/dataset.csv
DEBUG=True
```

#### Frontend
```bash
VITE_API_URL=http://127.0.0.1:8000
```

### Model Parameters
- **min_support**: 0.01 (1% of transactions)
- **min_confidence**: 0.2 (20% confidence threshold)
- **max_recommendations**: 5 (default recommendation count)

### Dataset Configuration
- **Supported Formats**: CSV with transaction columns
- **Encoding**: UTF-8
- **Separators**: Comma, tab, or custom
- **Missing Values**: Automatic handling

## Troubleshooting

### Common Issues

#### Backend Issues
- **Import Errors**: Ensure virtual environment is activated
- **Port Conflicts**: Change port in uvicorn command
- **Memory Errors**: Reduce dataset size or increase system memory

#### Frontend Issues
- **CORS Errors**: Check CORS middleware configuration
- **API Connection**: Verify VITE_API_URL setting
- **Build Errors**: Clear node_modules and reinstall

#### ML Issues
- **No Recommendations**: Check dataset quality and thresholds
- **Slow Training**: Increase min_support or use FP-Growth
- **Memory Usage**: Process data in batches

### Debug Mode
```bash
# Backend debug
python -m uvicorn app.main:app --reload --log-level debug

# Frontend debug
npm run dev -- --debug
```

### Logs
- **Backend**: Check console output from uvicorn
- **Frontend**: Browser developer tools console
- **ML Training**: Print statements in model files

## Contributing

### Development Workflow
1. **Fork Repository**: Create personal fork
2. **Create Branch**: `git checkout -b feature/new-feature`
3. **Make Changes**: Implement feature or fix
4. **Test Changes**: Run existing tests
5. **Submit PR**: Create pull request with description

### Code Standards
- **Backend**: PEP 8 style guide
- **Frontend**: ESLint configuration
- **Documentation**: Clear, concise comments
- **Testing**: Unit tests for critical functions

### Adding Features
1. **Backend API**: Add routes in `app/api/routes/`
2. **Frontend UI**: Create components in `src/components/`
3. **ML Models**: Extend base classes in `app/models/`
4. **Documentation**: Update this document

### Testing
```bash
# Backend tests
pytest

# Frontend tests
npm test

# Integration tests
# Use provided test scripts
```

---

**Last Updated**: March 22, 2026
**Version**: 1.0.0
**Authors**: Development Team