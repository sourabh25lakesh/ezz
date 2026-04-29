import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useCart } from "../context/CartContext";

function CheckoutPage() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        payment_method: "COD",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await authFetch(`${BASEURL}/api/orders/create/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setIsSuccess(true);
                setMessage("Order placed successfully!");
                clearCart();
                setTimeout(() => navigate("/"), 2000);
            } else {
                setIsSuccess(false);
                setMessage(data.error || "Failed to place order.");
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage("An error occurred.");
        }

        setLoading(false);
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,600&display=swap');
                .font-display { font-family: 'Bebas Neue', sans-serif; }

                .field {
                    width: 100%;
                    border: none;
                    border-bottom: 1.5px solid black;
                    padding: 0.65rem 0;
                    font-size: 0.85rem;
                    letter-spacing: 0.04em;
                    background: transparent;
                    outline: none;
                    color: black;
                    transition: border-color 0.2s ease;
                    font-family: 'DM Sans', sans-serif;
                }
                .field::placeholder { color: #aaa; font-size: 0.78rem; letter-spacing: 0.08em; }
                .field:focus { border-color: black; }

                .submit-btn {
                    position: relative; overflow: hidden;
                    width: 100%;
                    padding: 0.85rem;
                    border: 2px solid black;
                    background: black; color: white;
                    font-size: 0.7rem; letter-spacing: 0.2em;
                    text-transform: uppercase;
                    cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    transition: color 0.25s ease;
                }
                .submit-btn::after {
                    content: ''; position: absolute; inset: 0;
                    background: white;
                    transform: translateX(-101%);
                    transition: transform 0.28s cubic-bezier(0.22,1,0.36,1);
                    z-index: 0;
                }
                .submit-btn:hover:not(:disabled)::after { transform: translateX(0); }
                .submit-btn:hover:not(:disabled) { color: black; }
                .submit-btn span { position: relative; z-index: 1; }
                .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .form-anim { animation: fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
            `}</style>

            <div className="pt-16 min-h-screen bg-white flex flex-col"
                 style={{ fontFamily: "'DM Sans', sans-serif" }}>

                {/* Page header */}
                <div className="border-b-2 border-black px-8 py-10">
                    <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gray-400 mb-1">
                        Final Step
                    </p>
                    <h1 className="font-display text-[clamp(2.5rem,6vw,6rem)] leading-none tracking-wide">
                        Checkout
                    </h1>
                </div>

                {/* Form */}
                <div className="flex-1 flex items-start justify-center px-6 py-14">
                    <div className="form-anim w-full max-w-md">

                        <form onSubmit={handleSubmit} className="space-y-8">

                            <div>
                                <label className="text-[0.6rem] tracking-[0.18em] uppercase text-gray-400 block mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="field"
                                />
                            </div>

                            <div>
                                <label className="text-[0.6rem] tracking-[0.18em] uppercase text-gray-400 block mb-2">
                                    Full Address
                                </label>
                                <textarea
                                    name="address"
                                    placeholder="Street, City, Postal Code"
                                    value={form.address}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="field resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-[0.6rem] tracking-[0.18em] uppercase text-gray-400 block mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="+91 00000 00000"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="field"
                                />
                            </div>

                            <div>
                                <label className="text-[0.6rem] tracking-[0.18em] uppercase text-gray-400 block mb-2">
                                    Payment Method
                                </label>
                                <select
                                    name="payment_method"
                                    value={form.payment_method}
                                    onChange={handleChange}
                                    className="field"
                                >
                                    <option value="COD">Cash on Delivery</option>
                                    <option value="CreditCard">Online Payment</option>
                                </select>
                            </div>

                            {/* Divider */}
                            <div className="border-t-2 border-black pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="submit-btn"
                                >
                                    <span>{loading ? "Processing..." : "Place Order"}</span>
                                </button>
                            </div>

                            {message && (
                                <p className={`text-[0.7rem] tracking-[0.14em] uppercase text-center
                                               ${isSuccess ? "text-black" : "text-gray-400"}`}>
                                    {message}
                                </p>
                            )}
                        </form>

                    </div>
                </div>
            </div>
        </>
    );
}

export default CheckoutPage;