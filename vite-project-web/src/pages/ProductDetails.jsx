import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }

      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // ✅ ADD TO CART (STOCK LOCKED)
  const addToCart = () => {
    if (!user?.email) {
      alert("Login first");
      return;
    }

    if (!product.stock || product.stock <= 0) {
      alert("Sold out! No more stock available.");
      return;
    }

    const cartKey = `cart_${user.email}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const index = existingCart.findIndex((item) => item.id === product.id);

    const currentQty = index !== -1 ? existingCart[index].quantity : 0;

    if (currentQty + 1 > product.stock) {
      alert("Cannot exceed available stock");
      return;
    }

    if (index !== -1) {
      existingCart[index].quantity += 1;
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        quantity: 1,
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    alert("Added to cart!");
  };

  // ✅ BUY NOW
  const buyNow = () => {
    if (!product.stock || product.stock <= 0) {
      alert("Sold out!");
      return;
    }

    addToCart();
    navigate("/cart");
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;
  if (!product) return <p style={{ padding: "20px" }}>Product not found</p>;

  return (
    <div style={{ background: "#F5F7FA", minHeight: "100vh", color: "#111" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        background: "#0B0F1A",
        borderBottom: "2px solid #E53935",
        color: "white"
      }}>
        <div>
          <h2 style={{
            margin: 0,
            color: "#fff",
            letterSpacing: "2px",
            textShadow: "0 0 8px #FFD700, 0 0 18px rgba(255,215,0,0.6)"
          }}>
            Toys Star
          </h2>

          <p style={{
            margin: 0,
            fontSize: "12px",
            color: "#E0E0E0",
            borderLeft: "3px solid #FFD700",
            paddingLeft: "8px"
          }}>
            Your Toy Marketplace
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-secondary" onClick={() => navigate("/cart")}>
            Cart
          </button>

          <button className="btn-primary" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>

        {/* IMAGE */}
        <div className="card" style={{ flex: 1 }}>
          <img
            src={product.image || "https://via.placeholder.com/400"}
            alt={product.name}
            style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: "12px"
            }}
          />
        </div>

        {/* DETAILS */}
        <div className="card" style={{ flex: 1 }}>

          <h2>{product.name}</h2>

          <p className="rating">
            ⭐ {Number(product.rating || 0).toFixed(1)} | {product.sold || 0} sold
          </p>

          <h1 className="price">
            ₱{Number(product.price || 0).toLocaleString()}
          </h1>

          <div className="mecha-border">
            <p><b>Stock:</b> {product.stock}</p>
          </div>

          {product.stock <= 0 && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              SOLD OUT
            </p>
          )}

          <p style={{ marginTop: "10px", lineHeight: "1.5" }}>
            {product.description}
          </p>

          {/* ACTIONS */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>

            <button
              className="btn-primary"
              onClick={addToCart}
              disabled={!product.stock || product.stock <= 0}
              style={{
                opacity: !product.stock || product.stock <= 0 ? 0.5 : 1,
                cursor: !product.stock || product.stock <= 0 ? "not-allowed" : "pointer"
              }}
            >
              Add to Cart
            </button>

            <button
              className="btn-secondary"
              onClick={buyNow}
              disabled={!product.stock || product.stock <= 0}
              style={{
                opacity: !product.stock || product.stock <= 0 ? 0.5 : 1,
                cursor: !product.stock || product.stock <= 0 ? "not-allowed" : "pointer"
              }}
            >
              Buy Now
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;