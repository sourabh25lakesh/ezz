import { useEffect, useState, useRef } from "react";
import ProductCard from "../components/ProductCard.jsx";
import Footer from "../components/Footer.jsx";

/* ---------- Scroll-reveal hook ---------- */
function useScrollReveal(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(".reveal-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-10");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    cards.forEach((card, i) => {
      card.style.transitionDelay = `${(i % 4) * 80}ms`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [containerRef]);
}

/* ---------- Marquee items ---------- */
const MARQUEE_ITEMS = [
  "New Arrivals", "Free Shipping", "Exclusive Drops",
  "Best Sellers", "Limited Stock", "Shop Now",
  "New Arrivals", "Free Shipping", "Exclusive Drops",
  "Best Sellers", "Limited Stock", "Shop Now",
];

/* ---------- Main component ---------- */
function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const gridRef = useRef(null);
  useScrollReveal(gridRef);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    console.log("🔍 BASEURL:", BASEURL);
    console.log("📡 Fetching from:", `${BASEURL}/api/products/`);
    
    fetch(`${BASEURL}/api/products/`)
      .then((r) => {
        console.log("📦 Response status:", r.status);
        if (!r.ok) throw new Error("Failed to fetch products");
        return r.json();
      })
      .then((data) => { 
        console.log("✅ Products received:", data); 
        setProducts(data); 
        setLoading(false); 
      })
      .catch((err) => { 
        console.error("❌ Error fetching products:", err); 
        setError(err.message); 
        setLoading(false); 
      });
  }, []);

  return (
    <div className="min-h-screen bg-white text-black pt-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,600&display=swap');

        .font-display { font-family: 'Bebas Neue', sans-serif; }

        /* Marquee */
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track { animation: marquee 22s linear infinite; }

        /* Hero slide-up */
        @keyframes slideUp {
          from { transform: translateY(110%); }
          to   { transform: translateY(0); }
        }
        .hero-line-1 { animation: slideUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .hero-line-2 { animation: slideUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.17s both; }
        .hero-line-3 { animation: slideUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.28s both; }

        /* Hero sub fade */
        @keyframes fadeUp {
          from { opacity:0; transform: translateY(10px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .hero-sub { animation: fadeUp 0.6s ease 0.5s both; }

        /* Vertical rule scale */
        @keyframes scaleRule {
          from { transform: translateY(-50%) scaleY(0); }
          to   { transform: translateY(-50%) scaleY(1); }
        }
        .hero-rule {
          position: absolute; right: 2.5rem; top: 50%;
          width: 1.5px; height: 65%; background: black;
          transform-origin: top;
          animation: scaleRule 1.1s cubic-bezier(0.22,1,0.36,1) 0.3s both;
        }

        /* Button sweep fill */
        .btn-sweep {
          position: relative; overflow: hidden;
          transition: color 0.25s ease;
        }
        .btn-sweep::after {
          content: ''; position: absolute; inset: 0;
          background: black;
          transform: translateX(-101%);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
          z-index: 0;
        }
        .btn-sweep:hover::after { transform: translateX(0); }
        .btn-sweep:hover { color: white; }
        .btn-sweep span { position: relative; z-index: 1; }
        .btn-sweep.active { background: black; color: white; }
        .btn-sweep.active::after { transform: translateX(0); }

        /* Logo text swap */
        .logo-wrap { position: relative; overflow: hidden; display: inline-block; }
        .logo-top  { display: block; transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); }
        .logo-bot  {
          display: block; position: absolute; top: 0; left: 0;
          transform: translateY(110%); color: #888;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .logo-wrap:hover .logo-top { transform: translateY(-110%); }
        .logo-wrap:hover .logo-bot { transform: translateY(0); }

        /* Card image zoom */
        .card-img-wrap img {
          transition: transform 0.55s cubic-bezier(0.22,1,0.36,1);
        }
        .card-img-wrap:hover img { transform: scale(1.06); }

        /* Reveal card - START VISIBLE, animate on scroll */
        .reveal-card {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .reveal-card.is-hidden {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }

        /* Scrollbar */
        ::-webkit-scrollbar       { width: 5px; }
        ::-webkit-scrollbar-track { background: white; }
        ::-webkit-scrollbar-thumb { background: black; border-radius: 3px; }
      `}</style>

      {/* ─────────────── HEADER ─────────────── */}
      <header className="relative bg-white border-b-2 border-black
                         flex items-center justify-between px-8 h-16">
        <div className="font-display text-3xl leading-none logo-wrap h-8 w-36 cursor-default">
          <span className="logo-top">Products</span>
          <span className="logo-bot">Catalogue</span>
        </div>
        <span className="text-[0.65rem] tracking-[0.18em] uppercase text-gray-400">
          {loading ? "Loading..." : `${products.length} items`}
        </span>
      </header>

      {/* ─────────────── MARQUEE ─────────────── */}
      <div className="bg-black overflow-hidden border-b-2 border-black py-2">
        <div className="marquee-track flex gap-10 whitespace-nowrap w-max">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="font-display text-white text-sm tracking-[0.16em] uppercase">
              {item}<span className="text-gray-600 mx-3">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─────────────── HERO ─────────────── */}
      <section className="relative px-8 pt-20 pb-14 overflow-hidden">
        <div className="hero-rule" />

        <div className="overflow-hidden leading-none">
          <div className="font-display text-[clamp(3.5rem,9vw,9rem)] tracking-wide hero-line-1">
            Curated
          </div>
        </div>
        <div className="overflow-hidden leading-none">
          <div className="font-display text-[clamp(3.5rem,9vw,9rem)] tracking-wide hero-line-2">
            Selection
          </div>
        </div>
        <div className="overflow-hidden leading-none">
          <div className="font-display text-[clamp(3.5rem,9vw,9rem)] tracking-wide hero-line-3">
            For You
          </div>
        </div>
        <p className="hero-sub mt-6 text-[0.7rem] tracking-[0.2em] uppercase text-gray-400">
          Explore · Discover · Own
        </p>
      </section>

      {/* ─────────────── LOADING ─────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5">
          <div className="w-9 h-9 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-gray-400">
            Fetching products
          </p>
        </div>
      )}

      {/* ─────────────── ERROR ─────────────── */}
      {error && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <p className="font-display text-7xl tracking-wide">Error</p>
          <p className="text-[0.65rem] tracking-[0.18em] uppercase text-gray-400">{error}</p>
        </div>
      )}

      {/* ─────────────── FILTER + GRID ─────────────── */}
      {!loading && !error && (
        <>
          {/* Filter bar */}
          <div className="flex items-center gap-2 px-8 py-4 border-y-2 border-black overflow-x-auto">
            <span className="text-[0.62rem] tracking-[0.18em] uppercase text-gray-400 mr-3 whitespace-nowrap">
              Filter
            </span>
            {["All", "New", "Sale", "Top Rated"].map((f, i) => (
              <button
                key={f}
                className={`btn-sweep${i === 0 ? " active" : ""}
                  border-2 border-black text-[0.65rem] tracking-[0.14em]
                  uppercase px-4 py-2 whitespace-nowrap`}
              >
                <span>{f}</span>
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="p-6" ref={gridRef}>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                              gap-3 bg-black border-2 border-black">
                {products.map((product, i) => (
                  <div
                    key={product.id}
                    className="reveal-card relative bg-white
                               transition-all duration-700 ease-out group"
                  >
                    {/* Index label */}
                    <span className="absolute top-3 left-3 z-10 font-display text-[0.6rem]
                                     tracking-widest text-gray-400 pointer-events-none select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-[0.03]
                                    transition-opacity duration-300 pointer-events-none z-[1]" />

                    {/* ProductCard rendered inside image-zoom wrapper */}
                    <div className="card-img-wrap">
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
                <p className="font-display text-7xl tracking-wide">Empty</p>
                <p className="text-[0.65rem] tracking-[0.18em] uppercase text-gray-400">
                  No products available right now
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ─────────────── FOOTER ─────────────── */}
      <Footer />
    </div>
  );
}

export default ProductList;