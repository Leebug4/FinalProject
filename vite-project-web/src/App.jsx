import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BuyerLogin from "./pages/BuyerLogin";
import SellerLogin from "./pages/SellerLogin";
import BuyerRegister from "./pages/BuyerRegister";
import SellerRegister from "./pages/SellerRegister";
import SellerDashboard from "./pages/SellerDashboard";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import OrderHistory from "./pages/OrderHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/buyer" element={<BuyerLogin />} />
        <Route path="/seller" element={<SellerLogin />} />

        <Route path="/buyer-register" element={<BuyerRegister />} />
        <Route path="/seller-register" element={<SellerRegister />} />

        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;