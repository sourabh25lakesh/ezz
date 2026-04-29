import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { clearTokens, getAccessToken } from '../utils/auth.js';

function Navbar() {
    const { cartItems } = useCart();
    const navigate = useNavigate();

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const isLoggedIn = !!getAccessToken();

    const handleLogout = () => {
        clearTokens();
        navigate('/login');
    };

    return (
        <>
            <style>{`
                .nav-link {
                    position: relative;
                    font-size: 0.7rem;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: black;
                    text-decoration: none;
                    padding-bottom: 2px;
                }
                .nav-link::after {
                    content: '';
                    position: absolute;
                    left: 0; bottom: 0;
                    height: 1.5px;
                    width: 0;
                    background: black;
                    transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
                }
                .nav-link:hover::after { width: 100%; }

                .nav-btn-sweep {
                    position: relative; overflow: hidden;
                    font-size: 0.7rem; letter-spacing: 0.16em;
                    text-transform: uppercase;
                    border: 1.5px solid black;
                    padding: 0.35rem 1rem;
                    background: transparent;
                    color: black;
                    cursor: pointer;
                    transition: color 0.25s ease;
                }
                .nav-btn-sweep::after {
                    content: ''; position: absolute; inset: 0;
                    background: black;
                    transform: translateX(-101%);
                    transition: transform 0.28s cubic-bezier(0.22,1,0.36,1);
                    z-index: 0;
                }
                .nav-btn-sweep:hover::after { transform: translateX(0); }
                .nav-btn-sweep:hover { color: white; }
                .nav-btn-sweep span { position: relative; z-index: 1; }

                .logo-swap { position: relative; overflow: hidden; display: inline-block; }
                .logo-swap .ls-top { display: block; transition: transform 0.3s cubic-bezier(0.22,1,0.36,1); }
                .logo-swap .ls-bot {
                    display: block; position: absolute; top: 0; left: 0;
                    transform: translateY(110%); color: #888;
                    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
                }
                .logo-swap:hover .ls-top { transform: translateY(-110%); }
                .logo-swap:hover .ls-bot  { transform: translateY(0); }
            `}</style>

            <nav className="fixed w-full top-0 z-50 bg-white border-b-2 border-black
                            px-8 h-16 flex justify-between items-center"
                 style={{ fontFamily: "'DM Sans', sans-serif" }}>

                {/* Logo */}
                <Link to="/" className="logo-swap h-7 w-40 cursor-pointer"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.7rem', lineHeight: 1 }}>
                    <span className="ls-top">Shopping Cart</span>
                    <span className="ls-bot">Shop</span>
                </Link>

                {/* Auth links */}
                <div className="flex items-center gap-6">
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/signup" className="nav-link">Sign Up</Link>
                        </>
                    ) : (
                        <button onClick={handleLogout} className="nav-btn-sweep">
                            <span>Logout</span>
                        </button>
                    )}
                </div>

                {/* Cart */}
                <Link to="/cart" className="nav-link relative flex items-center gap-2">
                    <span>Cart</span>
                    {cartCount > 0 && (
                        <span className="ml-1 bg-black text-white text-[0.55rem] font-bold
                                         rounded-full h-4 w-4 flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </Link>

            </nav>
        </>
    );
}

export default Navbar;