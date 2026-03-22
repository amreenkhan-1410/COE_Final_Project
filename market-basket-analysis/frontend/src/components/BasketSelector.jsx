import { useState } from 'react';
import ProductCard from './ProductCard';

const BasketSelector = ({ onBasketChange }) => {
  const [selected, setSelected] = useState([]);
  const products = ['Milk', 'Bread', 'Egg', 'Butter', 'Cheese', 'Apple', 'Banana', 'Carrot'];

  const handleSelect = (product) => {
    const newSelected = selected.includes(product)
      ? selected.filter(p => p !== product)
      : [...selected, product];
    setSelected(newSelected);
    onBasketChange(newSelected);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select Products in Your Basket</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard
            key={product}
            product={product}
            onSelect={handleSelect}
            selected={selected.includes(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default BasketSelector;