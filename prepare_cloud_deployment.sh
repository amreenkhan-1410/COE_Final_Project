#!/bin/bash

# Cloud Deployment Preparation Script

echo "🚀 Market Basket Analysis - Cloud Deployment Preparation"
echo "======================================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for cloud deployment"
    echo "✅ Git repository initialized"
    echo ""
    echo "📋 Next steps:"
    echo "1. Create a new repository on GitHub"
    echo "2. Add the GitHub repository as remote:"
    echo "   git remote add origin https://github.com/yourusername/your-repo.git"
    echo "3. Push to GitHub:"
    echo "   git push -u origin main"
else
    echo "✅ Git repository already initialized"
fi

echo ""
echo "🔧 Deployment Files Created:"
echo "✅ render.yaml - For Render deployment"
echo "✅ vercel.json - For Vercel deployment"
echo "✅ Procfile - For Heroku deployment"
echo "✅ railway.json - For Railway deployment"
echo "✅ Updated requirements.txt with gunicorn"
echo "✅ Updated CORS configuration for production"

echo ""
echo "🌐 Choose Your Deployment Platform:"
echo ""
echo "1. Render + Vercel (Recommended - Easiest)"
echo "   - Backend: render.com"
echo "   - Frontend: vercel.com"
echo "   - Free tier available"
echo ""
echo "2. Railway (Alternative)"
echo "   - All-in-one: railway.app"
echo "   - Simple deployment"
echo ""
echo "3. Heroku (Classic)"
echo "   - Backend: heroku.com"
echo "   - Requires Heroku CLI"
echo ""

echo "📖 Read CLOUD_DEPLOYMENT.md for detailed instructions"
echo ""
echo "🎯 Quick Start with Render + Vercel:"
echo "1. Push code to GitHub"
echo "2. Deploy backend on Render"
echo "3. Deploy frontend on Vercel"
echo "4. Set VITE_API_URL in Vercel to your Render backend URL"
echo ""
echo "Your app will be live in minutes! 🚀"