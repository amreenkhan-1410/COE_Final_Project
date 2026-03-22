import { useMemo, useState } from 'react';
import {
  Apple,
  Beef,
  Candy,
  Fish,
  GlassWater,
  Milk,
  Package,
  Search,
  ShoppingBasket,
  Snowflake,
  Sparkles,
  Wheat,
} from 'lucide-react';

const iconGroups = [
  { tokens: ['milk', 'cream', 'cheese', 'curd', 'butter', 'yogurt'], Icon: Milk, tone: 'bg-emerald-50 text-primary' },
  { tokens: ['bread', 'bun', 'roll', 'pastry', 'cake', 'flour', 'waffles'], Icon: Wheat, tone: 'bg-amber-50 text-amber-700' },
  { tokens: ['fruit', 'apple', 'banana', 'berries', 'grapes', 'vegetables', 'onions', 'vegetable'], Icon: Apple, tone: 'bg-orange-50 text-orange-600' },
  { tokens: ['beef', 'ham', 'sausage', 'chicken', 'pork', 'turkey', 'meat'], Icon: Beef, tone: 'bg-rose-50 text-rose-600' },
  { tokens: ['fish'], Icon: Fish, tone: 'bg-sky-50 text-sky-600' },
  { tokens: ['frozen', 'ice cream'], Icon: Snowflake, tone: 'bg-cyan-50 text-cyan-600' },
  { tokens: ['water', 'soda', 'juice', 'coffee', 'tea', 'wine', 'beer', 'beverages'], Icon: GlassWater, tone: 'bg-blue-50 text-blue-600' },
  { tokens: ['chocolate', 'candy', 'dessert', 'snack'], Icon: Candy, tone: 'bg-pink-50 text-pink-600' },
];

const resolveProductMeta = (product) => {
  const normalized = product.toLowerCase();
  for (const group of iconGroups) {
    if (group.tokens.some((token) => normalized.includes(token))) {
      return group;
    }
  }

  return { Icon: Package, tone: 'bg-slate-100 text-slate-600' };
};

const ProductSelector = ({ products, selectedProducts, onSelectionChange, loading }) => {
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => product.toLowerCase().includes(normalizedQuery));
  }, [products, query]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const toggleProduct = (productName) => {
    const nextSelection = selectedProducts.includes(productName)
      ? selectedProducts.filter((product) => product !== productName)
      : [...selectedProducts, productName];

    onSelectionChange(nextSelection);
  };

  return (
    <section id="catalog" className="panel p-6 md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow">Smart selection</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink">Choose products from the live catalog</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Search the catalog, tap items to add them to your basket, and use the right panel to uncover
            well-matched companion products.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
          <div className="rounded-[22px] border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Catalog size</p>
            <p className="mt-1 text-xl font-semibold text-ink">{products.length}</p>
          </div>
          <div className="rounded-[22px] border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Selected</p>
            <p className="mt-1 text-xl font-semibold text-ink">{selectedProducts.length}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[26px] border border-white/70 bg-white/90 p-4 shadow-sm">
        <label className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-slate-50/80 px-4 py-3 focus-within:border-primary">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(24);
            }}
            placeholder="Search products like whole milk, soda, yogurt, rolls/buns..."
            className="w-full border-none bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-[26px] bg-white/70" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="mt-6 rounded-[28px] border border-dashed border-slate-200 bg-white/70 px-6 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Search className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-ink">No matching products</h3>
          <p className="mt-2 text-sm text-slate-500">Try a different keyword or browse the full catalog.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((productName) => {
              const { Icon, tone } = resolveProductMeta(productName);
              const isSelected = selectedProducts.includes(productName);

              return (
                <button
                  key={productName}
                  type="button"
                  onClick={() => toggleProduct(productName)}
                  className={`group rounded-[28px] border p-5 text-left transition duration-200 ${
                    isSelected
                      ? 'border-primary bg-emerald-50 shadow-lg shadow-emerald-100/80'
                      : 'border-white/80 bg-white/90 shadow-sm hover:-translate-y-1 hover:border-emerald-100 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-primary'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Add'}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-ink">{productName}</h3>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <ShoppingBasket className="h-4 w-4" />
                    <span>Tap to include in your basket</span>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredProducts.length > visibleCount && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 24)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
              >
                <Sparkles className="h-4 w-4" />
                Show more products
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ProductSelector;
