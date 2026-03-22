import { useState } from 'react';
import { Milk, Apple, Carrot, Banana, Egg, Wheat, Cookie, Pizza } from 'lucide-react';

const ProductCard = ({ product, onSelect, selected }) => {
  const icons = {
    Milk: Milk,
    Bread: Wheat,
    Apple: Apple,
    Carrot: Carrot,
    Banana: Banana,
    Egg: Egg,
    Butter: Cookie,
    Cheese: Pizza,
  };

  const Icon = icons[product] || Apple;

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        selected ? 'bg-primary text-white border-primary' : 'bg-card hover:bg-gray-50'
      }`}
      onClick={() => onSelect(product)}
    >
      <Icon className="w-8 h-8 mx-auto mb-2" />
      <p className="text-center font-medium">{product}</p>
    </div>
  );
};

export default ProductCard;
