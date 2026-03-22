import { useState } from 'react';
import BasketSelector from '../components/BasketSelector';
import RecommendationCard from '../components/RecommendationCard';
import api from '../services/api';

const Recommendations = () => {
  const [basket, setBasket] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const handleBasketChange = (newBasket) => {
    setBasket(newBasket);
  };

  const getRecommendations = async () => {
    if (basket.length === 0) return;
    try {
      const response = await api.post('/recommendation/', { basket });
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Recommendation error', error);
      alert('Error getting recommendations: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-primary">Product Recommendations</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <BasketSelector onBasketChange={handleBasketChange} />
          <button
            onClick={getRecommendations}
            className="mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 w-full"
          >
            Get Recommendations
          </button>
        </div>
        
        <RecommendationCard recommendations={recommendations} />
      </div>
    </div>
  );
};

export default Recommendations;