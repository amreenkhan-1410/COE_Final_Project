import { Lightbulb, ShoppingBag, Sparkles, Star } from 'lucide-react';

const RecommendationCard = ({ basket, recommendations, loading }) => {
  const hasSelection = basket.length > 0;
  const hasRecommendations = recommendations.length > 0;

  return (
    <section id="recommendations" className="panel p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Recommended for you</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink">Suggested add-ons for your basket</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Recommendations appear here after you pick products and ask the app to explore the strongest
            companion items from the shopping dataset.
          </p>
        </div>
        <div className="hidden rounded-3xl bg-accent/15 p-4 text-accent-strong md:block">
          <Sparkles className="h-7 w-7" />
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-[28px] bg-white/70" />
          ))}
        </div>
      ) : hasRecommendations ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {recommendations.map((recommendation) => (
            <article
              key={recommendation.name}
              className="rounded-[28px] border border-white/80 bg-white/95 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{recommendation.name}</h3>
                    <p className="text-sm text-slate-500">Popular companion item</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-primary">
                  {recommendation.strength}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">{recommendation.reason}</p>

              {recommendation.context_items?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {recommendation.context_items.map((item) => (
                    <span
                      key={`${recommendation.name}-${item}`}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      Pairs with {item}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[30px] border border-dashed border-slate-200 bg-white/70 px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-primary">
            {hasSelection ? <Lightbulb className="h-6 w-6" /> : <Star className="h-6 w-6" />}
          </div>
          <h3 className="mt-5 text-xl font-semibold text-ink">
            {hasSelection ? 'No strong add-ons for this combination yet' : 'Your personalized suggestions will appear here'}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
            {hasSelection
              ? 'Try a broader mix of products or choose a different basket combination. Recommendations only appear when the dataset supports a meaningful relationship.'
              : 'Select products from the catalog and use the basket panel to generate companion items for your current selection.'}
          </p>
        </div>
      )}
    </section>
  );
};

export default RecommendationCard;
