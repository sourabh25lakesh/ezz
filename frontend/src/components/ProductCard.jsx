import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/ProductCard.css";

function ProductCard({ product }) {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [isFavorite, setIsFavorite] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Image fix: prefix relative paths with Django base URL
    const imageSrc = product.image
        ? product.image.startsWith("http")
            ? product.image
            : `${BASEURL}${product.image}`
        : "/no-image.png";

    // Handle Add to Cart
    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!localStorage.getItem("access_token")) {
            navigate("/login");
            return;
        }

        try {
            setIsAddingToCart(true);
            await addToCart(product.id);
        } catch (err) {
            console.error("Cart error:", err);
        } finally {
            setIsAddingToCart(false);
        }
    };

    // Handle Favorite Toggle
    const handleFavoriteToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    // Calculate star rating (if not available, use default)
    const rating = product.rating || 4.5;
    const ratingCount = product.rating_count || Math.floor(Math.random() * 100) + 50;

    // Get category name safely
    const categoryName = typeof product.category === "object" 
        ? product.category?.name || "Product" 
        : product.category || "Product";

    return (
        <Link to={`/product/${product.id}`} className="product-card-link">
            <div className="product-card">
                {/* Wishlist Icon */}
                <button
                    onClick={handleFavoriteToggle}
                    className={`product-wishlist-btn ${isFavorite ? "active" : ""}`}
                    aria-label="Add to wishlist"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>

                {/* Product Image */}
                <div className="product-image-wrapper">
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => { e.target.src = "/no-image.png"; }}
                    />
                </div>

                {/* Product Info */}
                <div className="product-info">
                    {/* Category Badge */}
                    {categoryName && (
                        <span className="product-badge">{categoryName}</span>
                    )}

                    {/* Product Name */}
                    <h3 className="product-name">
                        {product.name}
                    </h3>

                    {/* Description */}
                    {product.description && typeof product.description === "string" && (
                        <p className="product-description">
                            {product.description.substring(0, 60)}
                            {product.description.length > 60 ? "..." : ""}
                        </p>
                    )}

                    {/* Rating */}
                    <div className="product-rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={`star ${i < Math.floor(rating) ? "filled" : i < rating ? "half" : ""}`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="rating-count">({ratingCount})</span>
                    </div>

                    {/* Price */}
                    <p className="product-price">
                        ${Number(product.price).toFixed(2)}
                    </p>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="product-btn-add-to-cart"
                    >
                        {isAddingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;