import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { Layout } from "./layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";

const Home = lazy(() => import("./pages/Home"));
const PhonesAccessories = lazy(
  () => import("./pages/PhonesAccessories")
);
const Repairs = lazy(() => import("./pages/Repairs"));
const WebDevelopment = lazy(
  () => import("./pages/WebDevelopment")
);
const POSServices = lazy(
  () => import("./pages/POSServices")
);
const Connectivity = lazy(
  () => import("./pages/Connectivity")
);
const Logistics = lazy(
  () => import("./pages/Logistics")
);
const ProductDetail = lazy(
  () => import("./pages/ProductDetail")
);
const Cart = lazy(() => import("./pages/Cart"));
const AdminLogin = lazy(
  () => import("./pages/AdminLogin")
);
const AdminAddProduct = lazy(
  () => import("./pages/AdminAddProduct")
);
const AdminProductList = lazy(
  () => import("./pages/AdminProductList")
);

const AdminOrders = lazy(
  () => import("./pages/AdminOrders")
);

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-neutral-950">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500/20 border-t-primary-500"
        aria-label="Loading"
      />
    </div>
  );
}

function GAPageTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}

function AppShell() {
  const { cart } = useCart();

  const cartCount = cart.reduce(
    (total, item) =>
      total + (item.quantity || 0),
    0
  );

  return (
    <>
      <GAPageTracker />

      <Layout cartCount={cartCount} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<AppShell />}>
              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/services/phones-accessories"
                element={<PhonesAccessories />}
              />

              <Route
                path="/services/repairs"
                element={<Repairs />}
              />

              <Route
                path="/services/web-development"
                element={<WebDevelopment />}
              />

              <Route
                path="/services/pos"
                element={<POSServices />}
              />

              <Route
                path="/services/connectivity"
                element={<Connectivity />}
              />

              <Route
                path="/services/logistics"
                element={<Logistics />}
              />

              <Route
                path="/product/:id"
                element={<ProductDetail />}
              />

              <Route
                path="/cart"
                element={<Cart />}
              />

              <Route
                path="/admin/login"
                element={<AdminLogin />}
              />

              <Route
                path="/admin/add-product"
                element={
                  <ProtectedRoute>
                    <AdminAddProduct />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute>
                    <AdminProductList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute>
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/terms"
                element={<Terms />}
              />

              <Route
                path="/privacy"
                element={<PrivacyPolicy />}
              />

            </Route>
          </Routes>
        </Suspense>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;