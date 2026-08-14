// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5001/api",
});

// -----------------------------------------------------------------------------
// AUTHORIZATION
// -----------------------------------------------------------------------------

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------------------------------------------------------
// PRODUCTS
// -----------------------------------------------------------------------------

export const fetchProducts = () =>
  API.get("/products");

export const fetchProductsByCategory = (category) =>
  API.get(
    `/products/category/${encodeURIComponent(category)}`
  );

export const fetchProductById = (id) =>
  API.get(`/products/${id}`);

export const createProduct = (formData) =>
  API.post("/products", formData);

/**
 * Update an existing product.
 *
 * This sends JSON because editing product information
 * does not require a new image upload.
 */
export const updateProduct = (id, data) =>
  API.patch(`/products/${id}`, data);

export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);

// -----------------------------------------------------------------------------
// AUTH
// -----------------------------------------------------------------------------

export const loginUser = (email, password) =>
  API.post("/auth/login", {
    email,
    password,
  });

export const verifyToken = () =>
  API.get("/auth/verify");

// -----------------------------------------------------------------------------
// CONTACT
// -----------------------------------------------------------------------------

export const sendContactMessage = (data) =>
  API.post("/contact", data);

// -----------------------------------------------------------------------------
// ORDERS / PAYMENTS
// -----------------------------------------------------------------------------

export const initializeOrder = (data) =>
  API.post("/orders/initialize", data);

export const verifyOrderPayment = (reference) =>
  API.get(
    `/orders/verify/${encodeURIComponent(reference)}`
  );

export default API;