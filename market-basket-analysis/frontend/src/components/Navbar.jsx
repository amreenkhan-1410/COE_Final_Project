import { LayoutDashboard, ShoppingBasket, Sparkles } from 'lucide-react';

const navItems = [
  { label: 'Discover', href: '#catalog' },
  { label: 'Recommendations', href: '#recommendations' },
  { label: 'Insights', href: '#insights' },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3 text-ink">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <ShoppingBasket className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/80">Basket intelligence</p>
            <h1 className="text-lg font-semibold tracking-tight">Meridian Market</h1>
          </div>
        </a>

        <nav className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/80 p-2 shadow-sm md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="rounded-full border border-white/80 bg-white/90 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
            <span className="inline-flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-primary" />
              Live retail recommendations
            </span>
          </div>
          <a
            href="#catalog"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            <Sparkles className="h-4 w-4" />
            Explore catalog
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
