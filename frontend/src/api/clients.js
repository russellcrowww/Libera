import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
});

// Books
export const getBooks = () => api.get("/api/books");
export const getBookById = (id) => api.get(`/api/books/${id}`);
export const getBooksByCategory = (categoryId) =>
  api.get(`/api/books/category/${categoryId}`);
export const createBook = (data) => api.post("/api/books", data);

// Categories
export const getCategories = () => api.get("/api/categories");
export const getCategoryById = (id) => api.get(`/api/categories/${id}`);
export const createCategory = (data) => api.post("/api/categories", data);