import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ProductCard from "../components/ProductCard";

function Home() {
  const [showAccount, setShowAccount] = useState(false);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [productList, setProductList] = useState([]);
  const [user, setUser] = useState(null);

  // LOAD USER
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // LOAD PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.log("FETCH ERROR:", error);
        return;
      }

      setProductList(data || []);
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ background: "#0B0F1A", minHeight: "100vh", color: "white" }}>

   {/* HEADER */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        background: "#0B0F1A",
        borderBottom: "2px solid #E53935",
        color: "white"
      }}
    >

      {/* LEFT TITLE */}
        <div>
          <h2 style={{
            margin: 0,
            color: "#FFFFFF",
            letterSpacing: "2px",
            fontWeight: "bold",
            textShadow: "0 0 8px #FFD700, 0 0 18px rgba(255, 215, 0, 0.6)"
          }}>
            Toys Star
          </h2>

          <p style={{
            margin: 0,
            fontSize: "12px",
            color: "#E0E0E0",
            borderLeft: "3px solid #FFD700",
            paddingLeft: "8px",
            marginTop: "4px",
            textShadow: "0 0 6px rgba(255, 215, 0, 0.3)"
          }}>
            Your Toy Marketplace
          </p>
        </div>

      {/* RIGHT BUTTONS */}
      {user ? (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

          <span style={{ color: "#FFD700" }}>
            Hi, {user.role}
          </span>

          {user.role === "seller" && (
            <button
              className="btn-secondary"
              onClick={() => navigate("/seller-dashboard")}
            >
              Dashboard
            </button>
          )}

          {user.role === "buyer" && (
            <>
              <button
                className="btn-secondary"
                onClick={() => navigate("/cart")}
              >
                Cart
              </button>

              <button
                className="btn-secondary"
                onClick={() => navigate("/orders")}
              >
                Orders
              </button>
            </>
          )}

          <button
            className="btn-primary"
            onClick={() => {
              localStorage.removeItem("user");
              setUser(null);
            }}
          >
            Logout
          </button>

        </div>
      ) : (
        <button
          className="btn-secondary"
          onClick={() => setShowAccount(true)}
        >
          Login / Account
        </button>
      )}

    </div>

      {/* SEARCH */}
      <div style={{ padding: "10px" }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #189c01",
            background: "#ffffff",
            color: "white"
          }}
        />
      </div>

      {/* PRODUCTS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "10px",
        padding: "10px"
      }}>
        {productList
          .filter((p) =>
            p.name?.toLowerCase().includes(search.toLowerCase())
          )
          .map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
      </div>
          {/* LOGIN MODAL */}
            {showAccount && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0.6)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 999
                }}
              >
                <div
                  style={{
                    background: "#FFFFFF",
                    fontStyle: "normal",
                    padding: "20px",
                    borderRadius: "12px",
                    width: "300px",
                    textAlign: "center",
                    border: "2px solid #E53935"
                  }}
                >
                  <h3 style={{ 
                  marginTop: 0,
                  color: "#111", 
                  fontWeight: "bold",
                  letterSpacing: "1px"
                }}>
                  Choose Account
                </h3>

                  <button
                    className="btn-secondary"
                    style={{ width: "100%", marginBottom: "10px" }}
                    onClick={() => navigate("/buyer")}
                  >
                    Buyer Login
                  </button>

                  <button
                    className="btn-secondary"
                    style={{ width: "100%", marginBottom: "10px" }}
                    onClick={() => navigate("/seller")}
                  >
                    Seller Login
                  </button>

                  <button
                    className="btn-primary"
                    style={{ width: "100%" }}
                    onClick={() => setShowAccount(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
    </div>
  );
}

export default Home;