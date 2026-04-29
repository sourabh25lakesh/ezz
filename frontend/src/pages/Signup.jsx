import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function Signup() {
    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    const { addToast } = useToast();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        password2: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (form.password !== form.password2) {
            addToast("Passwords do not match", "error", 3000);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${BASE}/api/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                addToast("Account created successfully!", "success", 2000);
                setTimeout(() => {
                    navigate("/login");
                }, 1200);
            } else {
                const errorMsg = 
                    data.username?.[0] ||
                    data.email?.[0] ||
                    data.password?.[0] ||
                    data.password2?.[0] ||
                    data.non_field_errors?.[0] ||
                    "Signup failed";
                addToast(errorMsg, "error", 3000);
            }
        } catch (err) {
            console.error(err);
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
                
                .btn-signup {
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
                .btn-signup::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: white;
                    transform: translateX(-101%);
                    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
                    z-index: 0;
                }
                .btn-signup:hover::after {
                    transform: translateX(0);
                }
                .btn-signup:hover {
                    color: black;
                }
                .btn-signup span {
                    position: relative;
                    z-index: 1;
                }
                .btn-signup:disabled {
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
                
                .password-hint {
                    font-size: 0.7rem;
                    color: #888;
                    margin-top: 0.3rem;
                }
            `}</style>

            <div className="max-w-sm w-full">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="font-display text-4xl tracking-wide mb-2">Create Account</h1>
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
                            placeholder="Choose a username"
                            required
                            className="input-field"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="text-xs tracking-[0.16em] uppercase text-gray-600 block mb-2">
                            Email
                        </label>
                        <input
                            name="email"
                            type="email"
                            onChange={handleChange}
                            value={form.email}
                            placeholder="Enter your email"
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
                            placeholder="Create a password"
                            required
                            className="input-field"
                            disabled={loading}
                        />
                        <p className="password-hint">Minimum 8 characters recommended</p>
                    </div>

                    <div>
                        <label className="text-xs tracking-[0.16em] uppercase text-gray-600 block mb-2">
                            Confirm Password
                        </label>
                        <input
                            name="password2"
                            type="password"
                            onChange={handleChange}
                            value={form.password2}
                            placeholder="Confirm your password"
                            required
                            className="input-field"
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn-signup mt-6"
                        disabled={loading}
                    >
                        <span>{loading ? "Creating account..." : "Create Account"}</span>
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t-2 border-black text-center text-sm">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link to="/login" className="link-text">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;