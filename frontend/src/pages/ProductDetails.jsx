import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL || "";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();

  // Fetch product
  const fetchProduct = async () => {
    try {
      const res = await fetch(`${BASEURL}/api/products/${id}/`);
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Failed to fetch product");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  useEffect(() => { fetchProduct(); }, [id]);

  // Add to cart
  const handleAddToCart = async () => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }
    try {
      setAdding(true);
      await addToCart(product.id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setAdding(false);
    }
  };

  // Image src helper
  const imageSrc = product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `${BASEURL}${product.image}`
    : null;

  // Loading state
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-white flex flex-col items-center justify-center gap-5"
           style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="w-9 h-9 border-2 border-black border-t-transparent rounded-full animate-spin" />
        <p className="text-[0.65rem] tracking-[0.18em] uppercase text-gray-400">Loading product</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-white flex flex-col items-center justify-center gap-3"
           style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <p className="font-display text-6xl tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          Error
        </p>
        <p className="text-[0.65rem] tracking-[0.18em] uppercase text-gray-400">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-16 min-h-screen bg-white flex items-center justify-center"
           style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <p className="text-[0.65rem] tracking-[0.18em] uppercase text-gray-400">No product found</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,600&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .detail-anim { animation: fadeInUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .detail-anim-2 { animation: fadeInUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both; }

        .add-btn {
          position: relative; overflow: hidden;
          border: 2px solid black;
          padding: 0.75rem 2rem;
          font-size: 0.7rem; letter-spacing: 0.18em;
          text-transform: uppercase;
          background: black; color: white;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.25s ease;
        }
        .add-btn::after {
          content: ''; position: absolute; inset: 0;
          background: white;
          transform: translateX(-101%);
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1);
          z-index: 0;
        }
        .add-btn:hover:not(:disabled)::after { transform: translateX(0); }
        .add-btn:hover:not(:disabled) { color: black; }
        .add-btn span { position: relative; z-index: 1; }
        .add-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .back-link {
          font-size: 0.65rem; letter-spacing: 0.16em;
          text-transform: uppercase; color: #888;
          background: none; border: none; cursor: pointer;
          padding: 0; font-family: 'DM Sans', sans-serif;
          transition: color 0.2s ease;
          display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .back-link:hover { color: black; }
      `}</style>

      <div className="pt-16 min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-0 border-2 border-black mt-8">

          {/* Image */}
          <div className="detail-anim w-full md:w-1/2 overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-black">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full h-80 md:h-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            ) : (
              <div className="w-full h-80 md:h-full bg-gray-100 flex items-center justify-center">
                <span className="text-[0.65rem] tracking-widest uppercase text-gray-400">No Image</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="detail-anim-2 flex-1 p-8 flex flex-col justify-between">
            <div>
              {/* Back */}
              <button onClick={() => navigate("/")} className="back-link mb-8">
                ← Back to Products
              </button>

              {/* Name */}
              <h1 className="font-display text-[clamp(2rem,5vw,4rem)] leading-none tracking-wide mb-4">
                {product.name}
              </h1>

              {/* Divider */}
              <div className="border-t-2 border-black my-5" />

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed font-light mb-6">
                {product.description}
              </p>

              {/* Price */}
              <p className="font-display text-4xl tracking-wide">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="add-btn"
              >
                <span>
                  {adding ? "Adding..." : added ? "Added to Cart" : "Add to Cart"}
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default ProductDetails;