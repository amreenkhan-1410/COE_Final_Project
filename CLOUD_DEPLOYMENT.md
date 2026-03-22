# Cloud Deployment Guide for Market Basket Analysis

## 🚀 Quick Cloud Deployment Options

Choose the platform that best fits your needs. All options are beginner-friendly and have generous free tiers.

---

## Option 1: Render + Vercel (Recommended - Easiest)

### Why Choose This?
- ✅ **Free tier available** (750 hours/month on Render, generous on Vercel)
- ✅ **Automatic deployments** from GitHub
- ✅ **No credit card required** for basic usage
- ✅ **Excellent FastAPI support** on Render
- ✅ **Perfect React support** on Vercel

### Step-by-Step Deployment

#### 1. Prepare Your Code
```bash
# Your code is already prepared! Files created:
# - render.yaml (for Render deployment)
# - vercel.json (for Vercel deployment)
# - Updated requirements.txt with gunicorn
# - Updated CORS configuration
```

#### 2. Create GitHub Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit for deployment"
# Create repository on GitHub and push
```

#### 3. Deploy Backend on Render

1. **Sign up**: Go to [render.com](https://render.com) and create account
2. **Connect GitHub**: Authorize Render to access your repository
3. **Create Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - **Service Name**: `market-basket-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
4. **Environment Variables**:
   ```
   PYTHON_VERSION=3.9.0
   MARKET_BASKET_DATASET_PATH=./datasets/processed_transactions.csv
   ```
5. **Deploy**: Click "Create Web Service"

**Your backend URL will be**: `https://your-app-name.onrender.com`

#### 4. Deploy Frontend on Vercel

1. **Sign up**: Go to [vercel.com](https://vercel.com) and create account
2. **Connect GitHub**: Authorize Vercel to access your repository
3. **Deploy**:
   - Click "New Project"
   - Import your GitHub repository
   - **Framework Preset**: `Vite` (should auto-detect)
   - **Root Directory**: `market-basket-analysis/frontend`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
5. **Deploy**: Click "Deploy"

**Your frontend URL will be**: `https://your-project.vercel.app`

---

## Option 2: Railway (Alternative)

### Why Choose Railway?
- ✅ **Very simple deployment**
- ✅ **PostgreSQL database included** (if needed later)
- ✅ **Great for FastAPI**

### Deployment Steps

1. **Sign up**: [railway.app](https://railway.app)
2. **Connect GitHub**: Link your repository
3. **Deploy**:
   - Railway will auto-detect your Python app
   - Uses the `railway.json` configuration
4. **Environment Variables**:
   ```
   MARKET_BASKET_DATASET_PATH=./datasets/processed_transactions.csv
   ```

---

## Option 3: Heroku (Classic Choice)

### Why Choose Heroku?
- ✅ **Widely used and documented**
- ✅ **Easy scaling later**

### Deployment Steps

1. **Install Heroku CLI**:
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and Create Apps**:
   ```bash
   heroku login
   heroku create your-backend-app
   heroku create your-frontend-app
   ```

3. **Deploy Backend**:
   ```bash
   cd market-basket-analysis/backend
   git init
   heroku git:remote -a your-backend-app
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

4. **Deploy Frontend**:
   ```bash
   cd ../frontend
   heroku git:remote -a your-frontend-app
   git push heroku main
   ```

---

## Option 4: DigitalOcean App Platform

### Why Choose DigitalOcean?
- ✅ **Predictable pricing**
- ✅ **Good performance**

### Deployment Steps

1. **Sign up**: [digitalocean.com](https://digitalocean.com)
2. **Create App**: Use the web interface
3. **Connect Repository**: Link your GitHub repo
4. **Configure**:
   - **Resource Type**: Web Service
   - **Source Directory**: `market-basket-analysis/backend`
   - **Run Command**: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

---

## 🔧 Environment Variables Reference

### Backend Environment Variables
```bash
# Required
MARKET_BASKET_DATASET_PATH=./datasets/processed_transactions.csv

# Optional
DEBUG=False
PRODUCTION_FRONTEND_URL=https://your-frontend.vercel.app
PYTHON_VERSION=3.9.0
```

### Frontend Environment Variables
```bash
# Required
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🚨 Important Notes

### 1. CORS Configuration
- Your backend is configured to accept requests from production URLs
- Make sure to update `PRODUCTION_FRONTEND_URL` if needed

### 2. Dataset Path
- The app expects the dataset at `./datasets/processed_transactions.csv`
- Make sure this file exists in your repository

### 3. Free Tier Limitations
- **Render**: 750 hours/month free
- **Vercel**: 100GB bandwidth/month free
- **Railway**: $5/month after trial

### 4. Custom Domain (Optional)
- All platforms support custom domains
- Useful for production applications

---

## 🧪 Testing Your Deployment

1. **Backend Health Check**:
   ```
   https://your-backend.onrender.com/health/
   ```

2. **API Documentation**:
   ```
   https://your-backend.onrender.com/docs
   ```

3. **Frontend Access**:
   ```
   https://your-frontend.vercel.app
   ```

---

## 🔄 Updating Your App

### Automatic Updates (Recommended)
- Push changes to your GitHub repository
- Platforms will auto-deploy on new commits

### Manual Updates
- Trigger redeploy in platform dashboard
- Or push new commits

---

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check logs in platform dashboard
   - Ensure all dependencies are in requirements.txt

2. **CORS Errors**:
   - Verify VITE_API_URL is correct
   - Check PRODUCTION_FRONTEND_URL in backend

3. **Dataset Not Found**:
   - Ensure `processed_transactions.csv` exists in `backend/datasets/`

4. **Port Issues**:
   - Platforms set $PORT automatically
   - Don't hardcode port numbers

### Getting Help
- **Render**: Check render.com/docs
- **Vercel**: Check vercel.com/docs
- **Railway**: Check railway.app/docs

---

## 🎯 Recommended Approach

For beginners: **Render + Vercel** (easiest setup)
For experienced users: **Railway** (most powerful)
For enterprise: **DigitalOcean** (most control)

Start with Render + Vercel - you can have your app live in under 30 minutes! 🚀