import { Link } from "react-router-dom";

function ProductCard({ product }) {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    // Image fix: prefix relative paths with Django base URL
    const imageSrc = product.image
        ? product.image.startsWith("http")
            ? product.image
            : `${BASEURL}${product.image}`
        : "/no-image.png";

    return (
        <Link to={`/product/${product.id}`} className="block group">
            <div className="bg-white overflow-hidden">

                {/* Image */}
                <div className="overflow-hidden">
                    <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-60 object-cover transition-transform duration-500
                                   ease-out group-hover:scale-105"
                        onError={(e) => { e.target.src = "/no-image.png"; }}
                    />
                </div>

                {/* Info */}
                <div className="p-4 border-t-2 border-black">
                    <h2
                        className="text-sm font-semibold tracking-wide uppercase truncate
                                   relative w-fit
                                   after:content-[''] after:absolute after:left-0 after:bottom-0
                                   after:h-px after:w-0 after:bg-black
                                   after:transition-all after:duration-300
                                   group-hover:after:w-full"
                    >
                        {product.name}
                    </h2>

                    <div className="flex items-center justify-between mt-3">
                        <p className="text-xs tracking-widest text-gray-500 uppercase font-light">
                            ${Number(product.price).toFixed(2)}
                        </p>
                        <span className="text-xs text-black transform translate-x-0
                                         group-hover:translate-x-1 transition-transform duration-200">
                            →
                        </span>
                    </div>
                </div>

            </div>
        </Link>
    );
}

export default ProductCard;