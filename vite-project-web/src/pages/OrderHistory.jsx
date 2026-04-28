import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  useEffect(() => {
    if (!user?.email) return;

    const orderKey = `orders_${user.email}`;
    const saved = JSON.parse(localStorage.getItem(orderKey)) || [];

    const sorted = saved.sort(
      (a, b) => Number(b.id || 0) - Number(a.id || 0)
    );

    setOrders(sorted);
  }, [user?.email]);

  const goHome = () => navigate("/");

  const handleCancel = (order) => {
    const cartKey = `cart_${user.email}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const restored = [...cart, ...(order.items || [])];

    localStorage.setItem(cartKey, JSON.stringify(restored));

    const updated = orders.filter((o) => o.id !== order.id);

    localStorage.setItem(`orders_${user.email}`, JSON.stringify(updated));

    setOrders(updated);

    alert("Order cancelled");
  };

  const handleReceive = async (order) => {
    const rating = prompt("Rate 1 - 5 ⭐");

    if (!rating || rating < 1 || rating > 5) {
      alert("Invalid rating");
      return;
    }

    const updated = orders.map((o) =>
      o.id === order.id
        ? { ...o, status: "received", rating: Number(rating) }
        : o
    );

    localStorage.setItem(`orders_${user.email}`, JSON.stringify(updated));
    setOrders(updated);

    for (const item of order.items) {
      const { data, error } = await supabase
        .from("products")
        .select("sold, rating")
        .eq("id", item.id)
        .single();

      if (error) continue;

      await supabase
        .from("products")
        .update({
          sold: (data.sold || 0) + (item.quantity || 1),
          rating: Number(rating),
        })
        .eq("id", item.id);
    }

    alert("Thanks for rating!");
  };

  if (!user?.email) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Please login first</h2>
        <button className="btn-secondary" onClick={goHome}>
          Back Home
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: "#F5F7FA",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>

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
            Toys Star Orders
          </h2>

          <p style={{
            margin: 0,
            fontSize: "12px",
            color: "#E0E0E0",
            borderLeft: "3px solid #FFD700",
            paddingLeft: "8px"
          }}>
            Your Purchase History
          </p>
        </div>

        <button className="btn-secondary" onClick={goHome}>
          ← Home
        </button>

      </div>

      {/* ORDERS LIST */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "15px"
      }}>

        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="card" style={{
              marginBottom: "12px"
            }}>

              <p><b>Date:</b> {order.date}</p>

              <p className="price">
                Total: ₱{Number(order.total || 0).toLocaleString()}
              </p>

              <p>
                <b>Status:</b>{" "}
                <span style={{
                  color: order.status === "received" ? "#1E88E5" : "#E53935"
                }}>
                  {order.status || "pending"}
                </span>
              </p>

              {/* ITEMS WITH IMAGE */}
              <div className="mecha-border" style={{ marginTop: "10px" }}>
                <b>Items:</b>

                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "10px",
                      padding: "8px",
                      border: "1px solid #D0D7E2",
                      borderRadius: "10px",
                      background: "#fff"
                    }}
                  >

                    {/* IMAGE */}
                    <img
                      src={item.image || "https://via.placeholder.com/70"}
                      alt={item.name}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: "1px solid #D0D7E2",
                        flexShrink: 0
                      }}
                    />

                    {/* DETAILS */}
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        {item.name}
                      </p>

                      <p className="price" style={{ margin: "5px 0" }}>
                        ₱{Number(item.price || 0).toLocaleString()}
                      </p>

                      <p style={{ margin: 0, fontSize: "13px" }}>
                        Qty: {item.quantity}
                      </p>
                    </div>

                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              {order.status === "pending" && (
                <div style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px"
                }}>

                  <button className="btn-secondary" onClick={() => handleReceive(order)}>
                    Order Received ⭐
                  </button>

                  <button className="btn-primary" onClick={() => handleCancel(order)}>
                    Cancel
                  </button>

                </div>
              )}

              {order.status === "received" && (
                <p style={{ marginTop: "10px" }}>
                  ⭐ Rated: {order.rating}/5
                </p>
              )}

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default OrderHistory;