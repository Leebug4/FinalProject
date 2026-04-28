import { useState } from "react";

function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login"); // login | register
  const [role, setRole] = useState("buyer"); // buyer | seller

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      
      <div style={{
        background: "white",
        padding: "20px",
        width: "350px",
        borderRadius: "10px"
      }}>

        <h2>{mode.toUpperCase()} ({role})</h2>

        {/* ROLE SWITCH */}
        <div>
          <button onClick={() => setRole("buyer")}>Buyer</button>
          <button onClick={() => setRole("seller")}>Seller</button>
        </div>

        {/* MODE SWITCH */}
        <div style={{ marginTop: "10px" }}>
          <button onClick={() => setMode("login")}>Login</button>
          <button onClick={() => setMode("register")}>Register</button>
        </div>

        <hr />

        {/* COMMON FIELDS */}
        <input placeholder="Username" style={{ width: "100%", margin: "5px 0" }} />
        <input placeholder="Email" style={{ width: "100%", margin: "5px 0" }} />
        <input placeholder="Password" type="password" style={{ width: "100%", margin: "5px 0" }} />
        <input placeholder="Phone Number" style={{ width: "100%", margin: "5px 0" }} />

        {/* SELLER EXTRA FIELDS */}
        {role === "seller" && mode === "register" && (
          <div>
            <input placeholder="Store Location" style={{ width: "100%", margin: "5px 0" }} />
            
            <p>Business Permit (upload)</p>
            <input type="file" />

            <p>Valid ID (upload)</p>
            <input type="file" />
          </div>
        )}

        <button style={{ marginTop: "10px", width: "100%" }}>
          {mode === "login" ? "Login" : "Register"}
        </button>

        <button onClick={onClose} style={{ marginTop: "5px", width: "100%" }}>
          Close
        </button>

      </div>
    </div>
  );
}

export default AuthModal;