import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function SellerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
    description: ""
  });

  // LOAD PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?.email) return;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_email", user.email);

      if (error) return console.log(error);

      setProducts(data || []);
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // ADD PRODUCT
  // =========================
  const saveProduct = async () => {
    if (!form.name || !form.price || !form.stock) {
      alert("Fill all required fields");
      return;
    }

    const newProduct = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image,
      description: form.description,
      rating: 0,
      sold: 0,
      seller_email: user?.email,
    };

    const { data, error } = await supabase
      .from("products")
      .insert([newProduct])
      .select();

    if (error) return console.log(error);

    setProducts((prev) => [...prev, ...data]);

    setForm({
      name: "",
      price: "",
      stock: "",
      image: "",
      description: ""
    });

    alert("Product added!");
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) return console.log(error);

    setProducts(products.filter((p) => p.id !== id));
  };

  // =========================
  // EDIT START
  // =========================
  const startEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      image: product.image,
      description: product.description
    });
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const updateProduct = async () => {
    const newStock = Number(form.stock);

    const { error } = await supabase
      .from("products")
      .update({
        name: form.name,
        price: Number(form.price),
        stock: newStock,
        image: form.image,
        description: form.description,
      })
      .eq("id", editingId);

    if (error) return console.log(error);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingId
          ? {
              ...p,
              ...form,
              price: Number(form.price),
              stock: newStock
            }
          : p
      )
    );

    setEditingId(null);

    setForm({
      name: "",
      price: "",
      stock: "",
      image: "",
      description: ""
    });

    alert("Product updated!");
  };

  return (
    <div style={{
      background: "#F5F7FA",
      minHeight: "100vh",
      padding: "20px",
      color: "#111"
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
        <h2 style={{ margin: 0, color: "#fff" }}>
          Toys Star Seller
        </h2>
      </div>

      {/* FORM */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>{editingId ? "Edit Product" : "Add Product"}</h3>

        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          {editingId ? (
            <button className="btn-primary" onClick={updateProduct}>
              Update Product
            </button>
          ) : (
            <button className="btn-primary" onClick={saveProduct}>
              Add Product
            </button>
          )}

          <button className="btn-secondary" onClick={() => navigate("/")}>
            Back Home
          </button>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="product-grid" style={{ marginTop: "20px" }}>
        {products.map((p) => {

          const stock = Number(p.stock || 0);
          const isSoldOut = stock <= 0;

          return (
            <div key={p.id} className="card">

              <img
                src={p.image || "https://via.placeholder.com/200"}
                style={{ width: "100%", height: "160px", objectFit: "cover" }}
              />

              <h3>{p.name}</h3>
              <p className="price">₱{p.price}</p>

              <p>⭐ {Number(p.rating || 0).toFixed(1)} | {p.sold || 0} sold</p>

              {/* 🔥 STOCK + SOLD OUT LOGIC */}
              <p>
                <b>Stock:</b>{" "}
                {isSoldOut ? (
                  <span style={{ color: "red" }}>SOLD OUT</span>
                ) : (
                  stock
                )}
              </p>

              <div style={{ display: "flex", gap: "5px" }}>
                <button className="btn-secondary" onClick={() => startEdit(p)}>
                  Edit
                </button>

                <button className="btn-primary" onClick={() => deleteProduct(p.id)}>
                  Delete
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

export default SellerDashboard;