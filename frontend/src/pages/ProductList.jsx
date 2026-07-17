import { useEffect, useState, useRef } from "react";
import ProductCard from "../components/ProductCard.jsx";
import Footer from "../components/Footer.jsx";

/* ---------- Scroll-reveal hook ---------- */
function useScrollReveal(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Target all product cards within the grid
    const cards = container.querySelectorAll(".product-card-link");
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
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

        /* Products Section - Modern Grid */
        .products-section {
          padding: 32px;
          background: #f5f5f5;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Scrollbar */
        ::-webkit-scrollbar       { width: 5px; }
        ::-webkit-scrollbar-track { background: white; }
        ::-webkit-scrollbar-thumb { background: black; border-radius: 3px; }

        /* Tablet */
        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
          }
          .products-section {
            padding: 24px;
          }
        }

        /* Mobile */
        @media (max-width: 640px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 12px;
          }
          .products-section {
            padding: 16px;
          }
        }
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
      <section 
        className="relative px-8 pt-20 pb-20 overflow-hidden min-h-[600px] flex flex-col justify-center"
        style={{
          backgroundImage: 'url(https://img.magnific.com/premium-psd/black-fashion…are-neon-green-theme-sale_1048816-2774.jpg?w=1480)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10">
          <div className="hero-rule" style={{right: '2.5rem', borderColor: 'white'}} />

          <div className="overflow-hidden leading-none">
            <div className="font-display text-[clamp(4rem,10vw,10rem)] tracking-wider hero-line-1 font-bold text-white drop-shadow-lg" style={{textShadow: '2px 4px 12px rgba(0,0,0,0.6)'}}>
              Curated
            </div>
          </div>
          <div className="overflow-hidden leading-none">
            <div className="font-display text-[clamp(4rem,10vw,10rem)] tracking-wider hero-line-2 font-bold text-white drop-shadow-lg" style={{textShadow: '2px 4px 12px rgba(0,0,0,0.6)'}}>
              Selection
            </div>
          </div>
          <div className="overflow-hidden leading-none">
            <div className="font-display text-[clamp(4rem,10vw,10rem)] tracking-wider hero-line-3 font-bold text-white drop-shadow-lg" style={{textShadow: '2px 4px 12px rgba(0,0,0,0.6)'}}>
              For You
            </div>
          </div>
          <p className="hero-sub mt-8 text-[0.85rem] tracking-[0.22em] uppercase text-white font-semibold" style={{textShadow: '1px 2px 8px rgba(0,0,0,0.6)'}}>
            Explore · Discover · Own
          </p>
        </div>
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
          <div className="flex w-[100% ] items-center justify-center      gap-6 px-8 py-2 mb-8    overflow-x-auto">
            <span className="text-[0.62rem] tracking-[0.18em] uppercase text-gray-400 whitespace-nowrap">
              Filter
            </span>
            {["All", "New", "Sale", "Top Rated"].map((f, i) => (
              <button
                key={f}
                className={`btn-sweep${i === 0 ? " active" : ""}
                  border-2 rounded-lg  border-gray-200 text-[0.65rem] tracking-[0.14em]
                  uppercase px-5 py-2 whitespace-nowrap`}
              >
                <span>{f}</span>
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="products-section" ref={gridRef}>
            {products.length > 0 ? (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
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