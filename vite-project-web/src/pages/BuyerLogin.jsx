import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BuyerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (!email || !password) return alert("Fill all fields");

    localStorage.setItem(
      "user",
      JSON.stringify({ email, role: "buyer" })
    );

    navigate("/");
  };

  return (
    <div style={{ background: "#0B0F1A", minHeight: "100vh", color: "white" }}>

      {/* UNIVERSAL HEADER (MATCH HOME STYLE) */}
      <div
        style={{
          padding: "15px",
          background: "#0B0F1A",
          borderBottom: "2px solid #E53935",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#FFFFFF",
            letterSpacing: "2px",
            fontWeight: "bold",
            textShadow:
              "0 0 8px #FFD700, 0 0 18px rgba(255, 215, 0, 0.6)",
          }}
        >
          Toys Star
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#E0E0E0",
            borderLeft: "3px solid #FFD700",
            paddingLeft: "8px",
            marginTop: "4px",
            textShadow: "0 0 6px rgba(255, 215, 0, 0.3)",
          }}
        >
          Your Toy Marketplace
        </p>
      </div>

    <div style={{ padding: "20px" }}>
      <h2>Buyer Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>Login</button>

      <button onClick={() => navigate("/buyer-register")} style={{ marginLeft: "10px" }}>
        Register
      </button>

      <br /><br />

      <button onClick={() => navigate("/")}>
        ← Back Home
      </button>
    </div>
  </div>
  );
}

export default BuyerLogin;