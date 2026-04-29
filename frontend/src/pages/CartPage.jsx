import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {
  const { cartItems, total, removeFromCart, updateQuantity } = useCart();
  console.log("Cart Items:", cartItems);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,600&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }

        .qty-btn {
            width: 2rem; height: 2rem;
            border: 1.5px solid black;
            background: white; color: black;
            font-size: 1rem; cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            position: relative; overflow: hidden;
            transition: color 0.2s ease;
        }
        .qty-btn::after {
            content: ''; position: absolute; inset: 0;
            background: black;
            transform: translateX(-101%);
            transition: transform 0.25s cubic-bezier(0.22,1,0.36,1);
            z-index: 0;
        }
        .qty-btn:hover::after { transform: translateX(0); }
        .qty-btn:hover { color: white; }
        .qty-btn span { position: relative; z-index: 1; }
        .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .remove-btn {
            font-size: 0.62rem; letter-spacing: 0.14em;
            text-transform: uppercase; color: #888;
            background: none; border: none; cursor: pointer;
            transition: color 0.2s ease;
            padding: 0;
        }
        .remove-btn:hover { color: black; }

        .checkout-btn {
            position: relative; overflow: hidden;
            font-size: 0.7rem; letter-spacing: 0.16em;
            text-transform: uppercase;
            border: 2px solid black;
            padding: 0.65rem 1.8rem;
            background: black; color: white;
            cursor: pointer;
            transition: color 0.25s ease;
            text-decoration: none;
            display: inline-block;
        }
        .checkout-btn::after {
            content: ''; position: absolute; inset: 0;
            background: white;
            transform: translateX(-101%);
            transition: transform 0.28s cubic-bezier(0.22,1,0.36,1);
            z-index: 0;
        }
        .checkout-btn:hover::after { transform: translateX(0); }
        .checkout-btn:hover { color: black; }
        .checkout-btn span { position: relative; z-index: 1; }

        .cart-row {
            opacity: 0;
            transform: translateY(16px);
            animation: rowIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes rowIn {
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="pt-16 min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Page header */}
        <div className="border-b-2 border-black px-8 py-10">
          <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gray-400 mb-1">Review</p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,6rem)] leading-none tracking-wide">
            Your Cart
          </h1>
        </div>

        {/* Empty state */}
        {!cartItems || cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <p className="font-display text-6xl tracking-wide text-gray-300">Empty</p>
            <p className="text-[0.65rem] tracking-[0.18em] uppercase text-gray-400">
              Your cart has no items
            </p>
            <Link to="/"
              className="checkout-btn mt-4">
              <span>Browse Products</span>
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-6 py-10">

            {/* Items */}
            <div className="border-t-2 border-black">
              {cartItems.map((item, i) => (
                <div
                  key={item.id || item.product_name}
                  className="cart-row border-b-2 border-black py-6 flex items-center gap-6"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  {/* Image */}
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden border border-gray-200">
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center
                                       text-[0.6rem] tracking-widest uppercase text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold tracking-wide uppercase truncate">
                      {item.product_name}
                    </h2>
                    <p className="text-[0.7rem] tracking-widest text-gray-400 uppercase mt-1">
                      ${Number(item.product_price).toFixed(2)}
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-3">
                    <button
                      className="qty-btn"
                      disabled={item.quantity <= 1}
                      onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                    >
                      <span>−</span>
                    </button>

                    <span className="text-sm font-semibold w-5 text-center tabular-nums">
                      {item.quantity}
                    </span>

                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <span>+</span>
                    </button>
                  </div>

                  {/* Subtotal */}
                  <p className="text-sm font-semibold w-20 text-right tabular-nums">
                    ${(Number(item.product_price) * item.quantity).toFixed(2)}
                  </p>

                  {/* Remove */}
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Total + checkout */}
            <div className="mt-8 flex items-center justify-between">
              <div>
                <p className="text-[0.62rem] tracking-[0.18em] uppercase text-gray-400">Total</p>
                <p className="font-display text-4xl tracking-wide mt-1">
                  ${Number(total || 0).toFixed(2)}
                </p>
              </div>
              <Link to="/checkout" className="checkout-btn">
                <span>Proceed to Checkout</span>
              </Link>
            </div>

          </div>
        )}
      </div>
    </>
  );
}

export default CartPage;