import { ArrowRight, RotateCcw, ShoppingBasket, X } from 'lucide-react';

const SelectedBasket = ({
  basket,
  onRemoveItem,
  onClear,
  onSubmit,
  loading,
  recommendationCount,
}) => {
  return (
    <aside className="panel sticky top-24 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Your basket</span>
          <h2 className="mt-4 text-2xl font-semibold text-ink">Build a better basket</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Pick the items you already want and uncover complementary products worth adding.
          </p>
        </div>
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <ShoppingBasket className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6 rounded-[24px] bg-emerald-50/80 p-4">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Selected items</span>
          <span className="rounded-full bg-white px-3 py-1 font-semibold text-ink shadow-sm">
            {basket.length}
          </span>
        </div>
        <div className="mt-4 min-h-24">
          {basket.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {basket.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onRemoveItem(item)}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-primary hover:text-primary"
                >
                  <span>{item}</span>
                  <X className="h-4 w-4" />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-24 items-center justify-center rounded-[20px] border border-dashed border-emerald-200 bg-white/70 px-4 text-center text-sm text-slate-500">
              Start by choosing one or more products from the catalog.
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-[22px] border border-white/70 bg-white/90 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Suggestions</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{recommendationCount}</p>
          <p className="mt-1 text-sm text-slate-500">active add-on ideas</p>
        </div>
        <div className="rounded-[22px] border border-white/70 bg-white/90 p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Basket size</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{basket.length}</p>
          <p className="mt-1 text-sm text-slate-500">selected products</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={basket.length === 0 || loading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? 'Refreshing suggestions...' : 'Reveal smart add-ons'}
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={basket.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" />
          Clear basket
        </button>
      </div>
    </aside>
  );
};

export default SelectedBasket;
