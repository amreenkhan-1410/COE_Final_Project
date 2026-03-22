from app.services.analysis_service import recommend_products

def get_recommendations(basket):
    return recommend_products(basket)
