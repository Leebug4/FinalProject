import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const addToCart = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.email) {
      alert("Login first");
      return;
    }

    const stock = Number(product.stock || 0);

    if (stock <= 0) {
      alert("Sold out!");
      return;
    }

    const cartKey = `cart_${user.email}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const index = cart.findIndex((item) => item.id === product.id);

    const currentQty = index !== -1 ? cart[index].quantity : 0;

    // ✅ STRICT STOCK LIMIT
    if (currentQty >= stock) {
      alert(`Only ${stock} stock available!`);
      return;
    }

    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: stock,
        quantity: 1,
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));

    alert("Added to cart!");
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "10px",
        cursor: "pointer",
      }}
    >
      <img
        src={product.image || "https://via.placeholder.com/150"}
        style={{ width: "100%", height: "140px", objectFit: "cover" }}
      />

      <h4>{product.name}</h4>
      <p>₱{product.price}</p>
      <p>⭐ {product.rating} | {product.sold} sold</p>

      <button
        onClick={(e) => {
          e.stopPropagation(); // ❗ IMPORTANT FIX (no double click bug)
          addToCart();
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;