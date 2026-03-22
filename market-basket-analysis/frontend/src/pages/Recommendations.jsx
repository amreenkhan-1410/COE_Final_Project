import { Suspense, lazy, useEffect, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Boxes,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import ProductSelector from '../components/ProductSelector';
import RecommendationCard from '../components/RecommendationCard';
import SelectedBasket from '../components/SelectedBasket';
import api from '../services/api';

const InsightsDashboard = lazy(() => import('../components/InsightsDashboard'));

const Recommendations = () => {
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [basket, setBasket] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [requestingRecommendations, setRequestingRecommendations] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadExperience = async () => {
      try {
        const response = await api.get('/analytics/');
        setAnalytics(response.data);
        setProducts(response.data.products || []);
        setError('');
      } catch (requestError) {
        setError('The recommendation experience is temporarily unavailable. Please try again in a moment.');
      } finally {
        setLoadingPage(false);
      }
    };

    loadExperience();
  }, []);

  const handleBasketChange = (nextBasket) => {
    setBasket(nextBasket);
    if (nextBasket.length === 0) {
      setRecommendations([]);
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    const nextBasket = basket.filter((item) => item !== itemToRemove);
    handleBasketChange(nextBasket);
  };

  const handleClearBasket = () => {
    handleBasketChange([]);
  };

  const getRecommendations = async () => {
    if (basket.length === 0) {
      return;
    }

    try {
      setRequestingRecommendations(true);
      const response = await api.post('/recommendation/', { basket });
      setRecommendations(response.data.recommendations || []);
      setError('');

      window.setTimeout(() => {
        document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } catch (requestError) {
      setError('We could not refresh recommendations right now. Please try again.');
    } finally {
      setRequestingRecommendations(false);
    }
  };

  const heroHighlights = analytics?.highlights?.slice(0, 4) || [];

  return (
    <div id="top" className="relative overflow-hidden">
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/80 px-6 py-8 shadow-premium backdrop-blur-xl md:px-10 md:py-12">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(31,111,94,0.14),transparent_58%),radial-gradient(circle_at_bottom_right,rgba(228,149,103,0.18),transparent_55%)] lg:block" />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center">
            <div>
              <span className="eyebrow">Retail recommendation studio</span>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-ink md:text-6xl">
                Discover smart product combinations with a premium shopping intelligence experience.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                Explore a live product catalog, build a basket, and reveal the companion items shoppers
                most often choose together.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#catalog"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-dark"
                >
                  Start exploring
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#insights"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
                >
                  <BarChart3 className="h-4 w-4" />
                  View shopping insights
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <article className="rounded-[26px] bg-white/90 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-50 p-3 text-primary">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Catalog</p>
                      <p className="text-2xl font-semibold text-ink">{analytics?.total_products ?? '--'}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Products ready for basket discovery.</p>
                </article>
                <article className="rounded-[26px] bg-white/90 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-orange-50 p-3 text-accent-strong">
                      <Boxes className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Baskets</p>
                      <p className="text-2xl font-semibold text-ink">
                        {analytics?.total_transactions ? analytics.total_transactions.toLocaleString() : '--'}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Transactions shaping recommendation quality.</p>
                </article>
                <article className="rounded-[26px] bg-white/90 p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3 text-ink">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Typical basket</p>
                      <p className="text-2xl font-semibold text-ink">{analytics?.average_basket_size ?? '--'}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-500">Average number of items per visit.</p>
                </article>
              </div>
            </div>

            <div className="panel relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(31,111,94,0.12),transparent_56%)]" />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/80">
                      Snapshot
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-ink">Retail pulse at a glance</h2>
                  </div>
                  <div className="rounded-2xl bg-white p-3 text-primary shadow-sm">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {heroHighlights.length > 0 ? (
                    heroHighlights.map((highlight) => (
                      <article
                        key={highlight.title}
                        className="rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{highlight.title}</p>
                            <p className="mt-2 text-xl font-semibold text-ink">{highlight.value}</p>
                          </div>
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-primary">
                            Live
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-500">{highlight.description}</p>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/80 p-6 text-sm text-slate-500">
                      The dashboard snapshot will appear after analytics finish loading.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_380px]">
          <ProductSelector
            products={products}
            selectedProducts={basket}
            onSelectionChange={handleBasketChange}
            loading={loadingPage}
          />
          <SelectedBasket
            basket={basket}
            onRemoveItem={handleRemoveItem}
            onClear={handleClearBasket}
            onSubmit={getRecommendations}
            loading={requestingRecommendations}
            recommendationCount={recommendations.length}
          />
        </section>

        <div className="mt-6">
          <RecommendationCard
            basket={basket}
            recommendations={recommendations}
            loading={requestingRecommendations}
          />
        </div>

        <Suspense
          fallback={
            <div className="mt-10 panel p-6 text-sm text-slate-500">
              Preparing the latest shopping insights...
            </div>
          }
        >
          <div className="mt-10">
            <InsightsDashboard analytics={analytics} />
          </div>
        </Suspense>

        <footer className="mt-12 rounded-[32px] border border-white/70 bg-white/80 px-6 py-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/80">Meridian Market</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">A polished shopping companion built for live recommendations.</h2>
            </div>
            <a
              href="#top"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
            >
              Back to top
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Recommendations;
