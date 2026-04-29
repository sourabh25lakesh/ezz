import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveTokens } from "../utils/auth";
import { useToast } from "../context/ToastContext";

function Login() {
    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
    const { addToast } = useToast();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${BASE}/api/token/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok) {
                saveTokens(data);
                addToast("Login successful!", "success", 2000);
                setTimeout(() => {
                    navigate("/");
                }, 800);
            } else {
                addToast(data.detail || "Login failed. Please try again.", "error", 3000);
            }
        } catch (error) {
            console.error(error);
            addToast("Server error. Please try again.", "error", 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center p-6" 
             style={{ fontFamily: "'DM Sans', sans-serif" }}>
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,600&display=swap');
                
                .font-display { font-family: 'Bebas Neue', sans-serif; }
                
                .input-field {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1.5px solid black;
                    background: white;
                    font-family: inherit;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                    outline: none;
                }
                .input-field:focus {
                    box-shadow: 0 0 0 3px rgba(0,0,0,0.1);
                }
                
                .btn-login {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border: 2px solid black;
                    background: black;
                    color: white;
                    font-family: inherit;
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: color 0.25s ease;
                }
                .btn-login::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: white;
                    transform: translateX(-101%);
                    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
                    z-index: 0;
                }
                .btn-login:hover::after {
                    transform: translateX(0);
                }
                .btn-login:hover {
                    color: black;
                }
                .btn-login span {
                    position: relative;
                    z-index: 1;
                }
                .btn-login:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .link-text {
                    color: black;
                    text-decoration: none;
                    font-weight: 600;
                    position: relative;
                    padding-bottom: 2px;
                }
                .link-text::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 0;
                    height: 1px;
                    background: black;
                    transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
                }
                .link-text:hover::after {
                    width: 100%;
                }
            `}</style>

            <div className="max-w-sm w-full">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="font-display text-4xl tracking-wide mb-2">Login</h1>
                    <div className="w-12 h-px bg-black"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs tracking-[0.16em] uppercase text-gray-600 block mb-2">
                            Username
                        </label>
                        <input
                            name="username"
                            onChange={handleChange}
                            value={form.username}
                            placeholder="Enter your username"
                            required
                            className="input-field"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="text-xs tracking-[0.16em] uppercase text-gray-600 block mb-2">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            onChange={handleChange}
                            value={form.password}
                            placeholder="Enter your password"
                            required
                            className="input-field"
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn-login mt-6"
                        disabled={loading}
                    >
                        <span>{loading ? "Logging in..." : "Login"}</span>
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t-2 border-black text-center text-sm">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link to="/signup" className="link-text">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;