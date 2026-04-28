import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function SellerRegister() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [permit, setPermit] = useState("");
  const [validId, setValidId] = useState("");

  const register = async () => {
    if (!name || !email || !password || !phone || !location || !permit || !validId)
      return alert("Fill all fields");

    const newUser = {
      name,
      email,
      password,
      phone,
      role: "seller",
      store_location: location,
      business_permit: permit,
      valid_id: validId,
    };

    const { error } = await supabase.from("users").insert([newUser]);

    if (error) {
      console.log(error);
      alert("Register failed");
      return;
    }

    localStorage.setItem("user", JSON.stringify(newUser));

    alert("Seller Registered!");
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

      {/* FORM */}
      <div style={{ padding: "20px" }}>
        <h2>Seller Register</h2>

        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input placeholder="Store Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input placeholder="Business Permit" value={permit} onChange={(e) => setPermit(e.target.value)} />
        <input placeholder="Valid ID" value={validId} onChange={(e) => setValidId(e.target.value)} />

        <br /><br />

        <button onClick={register}>Register</button>

        <button onClick={() => navigate("/seller-login")} style={{ marginLeft: "10px" }}>
          Login
        </button>

        <br /><br />

        <button onClick={() => navigate("/")}>
          ← Back Home
        </button>
      </div>
    </div>
  );
}

export default SellerRegister;