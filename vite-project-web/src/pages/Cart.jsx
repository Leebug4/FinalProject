import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState({});

  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    if (!user?.email) return;

    const cartKey = `cart_${user.email}`;
    const saved = JSON.parse(localStorage.getItem(cartKey)) || [];

    setCart(saved);
  }, [user?.email]);

  const saveCart = (updated) => {
    setCart(updated);

    if (!user?.email) return;

    const cartKey = `cart_${user.email}`;
    localStorage.setItem(cartKey, JSON.stringify(updated));
  };

  const toggleSelect = (id) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isAllSelected =
    cart.length > 0 && cart.every((item) => selected[item.id]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected({});
    } else {
      const all = {};
      cart.forEach((item) => {
        all[item.id] = true;
      });
      setSelected(all);
    }
  };

  // 🔥 FIXED STOCK SAFE QUANTITY
  const updateQuantity = (id, type) => {
    const updated = cart.map((item) => {
      if (item.id === id) {

        const stock = Number(item.stock || 0);
        let newQty = item.quantity;

        if (type === "add") {

          if (newQty >= stock) {
            alert(`Only ${stock} stock available!`);
            return item;
          }

          newQty += 1;

        } else {
          newQty -= 1;
        }

        if (newQty < 1) newQty = 1;

        return { ...item, quantity: newQty };
      }

      return item;
    });

    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);

    setSelected((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const selectedTotal = cart.reduce((sum, item) => {
    if (selected[item.id]) {
      return sum + Number(item.price) * item.quantity;
    }
    return sum;
  }, 0);

  // 🔥 SAFE CHECKOUT
  const checkout = () => {
    const orderKey = `orders_${user.email}`;

    const selectedItems = cart.filter((item) => selected[item.id]);

    if (selectedItems.length === 0) {
      alert("Pumili ka muna ng item");
      return;
    }

    const existing = JSON.parse(localStorage.getItem(orderKey)) || [];

    const newOrders = selectedItems.map((item) => {
      const stock = Number(item.stock || 0);
      const safeQty = item.quantity > stock ? stock : item.quantity;

      return {
        id: Date.now() + Math.random(),
        items: [
          {
            ...item,
            quantity: safeQty
          }
        ],
        total: Number(item.price || 0) * safeQty,
        date: new Date().toLocaleString(),
        status: "pending",
      };
    });

    localStorage.setItem(orderKey, JSON.stringify([...existing, ...newOrders]));

    const remaining = cart.filter((item) => !selected[item.id]);

    saveCart(remaining);
    setSelected({});

    alert(`Checkout successful! ₱${selectedTotal}`);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#F5F7FA" }}>

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
            textShadow: "0 0 8px #FFD700, 0 0 18px rgba(255,215,0,0.6)",
            letterSpacing: "2px"
          }}>
            Toys Star Cart
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

        <button className="btn-secondary" onClick={() => navigate("/")}>
          ← Home
        </button>
      </div>

      {/* ITEMS */}
      <div style={{ flex: 1, overflowY: "auto", padding: "15px" }}>

        {cart.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="card" style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              marginBottom: "10px"
            }}>

              {/* CHECKBOX */}
              <input
                type="checkbox"
                checked={selected[item.id] || false}
                onChange={() => toggleSelect(item.id)}
                style={{ width: "18px", height: "18px", accentColor: "#E53935" }}
              />

              {/* IMAGE */}
              <img
                src={item.image || "https://via.placeholder.com/80"}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "1px solid #D0D7E2"
                }}
              />

              {/* DETAILS */}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>{item.name}</h4>

                <p className="price">
                  ₱{Number(item.price || 0).toLocaleString()}
                </p>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button className="btn-secondary" onClick={() => updateQuantity(item.id, "minus")}>-</button>
                  <span>{item.quantity}</span>
                  <button className="btn-secondary" onClick={() => updateQuantity(item.id, "add")}>+</button>
                </div>
              </div>

              <button className="btn-primary" onClick={() => removeItem(item.id)}>
                Remove
              </button>

            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      {cart.length > 0 && (
        <div style={{
          borderTop: "2px solid #D0D7E2",
          padding: "15px",
          background: "#FFFFFF"
        }}>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
              /> Select All
            </label>

            <h3 className="price">
              ₱{Number(selectedTotal || 0).toLocaleString()}
            </h3>
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", marginTop: "10px" }}
            onClick={checkout}
          >
            Checkout Selected
          </button>

        </div>
      )}

    </div>
  );
}

export default Cart;