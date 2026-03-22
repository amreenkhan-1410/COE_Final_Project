import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, Boxes, Sparkles, TrendingUp } from 'lucide-react';

const tooltipStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.96)',
  border: '1px solid rgba(219, 231, 223, 0.9)',
  borderRadius: '16px',
  boxShadow: '0 18px 48px rgba(31, 43, 58, 0.12)',
};

const InsightsDashboard = ({ analytics }) => {
  if (!analytics) {
    return (
      <section id="insights" className="panel p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white p-3 text-primary shadow-sm">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-ink">Shopping insights</h2>
            <p className="text-sm text-slate-500">Insights will appear as soon as the catalog is ready.</p>
          </div>
        </div>
      </section>
    );
  }

  const topProducts = analytics.top_products || [];
  const basketSizeDistribution = analytics.basket_size_distribution || [];
  const topPairings = analytics.top_pairings || [];
  const highlights = analytics.highlights || [];

  return (
    <section id="insights" className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">Market signals</span>
          <h2 className="section-title mt-4">A live view of basket behavior</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            The catalog, recommendation space, and product relationships shown below are derived from the
            current transaction dataset powering the application.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {highlights.slice(0, 6).map((highlight) => (
          <article key={highlight.title} className="panel p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{highlight.title}</p>
            <p className="mt-3 text-2xl font-semibold text-ink">{highlight.value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{highlight.description}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <article className="panel p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-ink">Most active products</h3>
              <p className="text-sm text-slate-500">Items that appear most often across shopping baskets.</p>
            </div>
          </div>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts.slice(0, 8)}
                margin={{ top: 10, right: 10, left: -10, bottom: 24 }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(193, 208, 198, 0.45)" vertical={false} />
                <XAxis
                  dataKey="name"
                  angle={-20}
                  height={56}
                  tick={{ fill: '#5f6d74', fontSize: 12 }}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: '#5f6d74', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(216, 239, 227, 0.32)' }} />
                <Bar dataKey="frequency" radius={[10, 10, 0, 0]} fill="#1f6f5e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-accent/15 p-3 text-accent-strong">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-ink">Basket mix</h3>
              <p className="text-sm text-slate-500">How broad the typical basket tends to be.</p>
            </div>
          </div>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={basketSizeDistribution} margin={{ top: 10, right: 6, left: -18, bottom: 6 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(193, 208, 198, 0.45)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#5f6d74', fontSize: 12 }} />
                <YAxis tick={{ fill: '#5f6d74', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(252, 219, 195, 0.28)' }} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="#e49567" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <article className="panel p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white p-3 text-primary shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-ink">Popular companion combinations</h3>
            <p className="text-sm text-slate-500">Recurring product pairings that shape the strongest add-on ideas.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {topPairings.length > 0 ? (
            topPairings.map((pairing) => (
              <article
                key={pairing.items_label}
                className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Commonly added together</p>
                <h4 className="mt-3 text-lg font-semibold text-ink">{pairing.items_label}</h4>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-primary">
                    {pairing.share_label} of baskets
                  </span>
                  <span className="text-sm text-slate-500">{pairing.frequency} baskets</span>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
              Pairing insights will appear when the dataset contains enough repeat basket combinations.
            </div>
          )}
        </div>
      </article>
    </section>
  );
};

export default InsightsDashboard;
