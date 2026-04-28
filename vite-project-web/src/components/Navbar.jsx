import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{
      background: "#ee4d2d",
      padding: "10px",
      display: "flex",
      justifyContent: "space-between",
      color: "white"
    }}>
      
      <h2>Shopee Clone</h2>

      <input
        type="text"
        placeholder="Search products..."
        style={{ width: "300px", padding: "5px" }}
      />

      <Link to="/cart" style={{ color: "white" }}>
        🛒 Cart
      </Link>
    </div>
  );
}

export default Navbar;