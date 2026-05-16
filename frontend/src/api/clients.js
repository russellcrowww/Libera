import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
});

export const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${api.defaults.baseURL}${path}`;
};

// Books
export const getBooks = () => api.get("/api/books");
export const getBooksFiltered = (params) => api.get("/api/books", { params });
export const getBookById = (id) => api.get(`/api/books/${id}`);
export const getBooksByCategory = (categoryId) =>
  api.get(`/api/books/category/${categoryId}`);
export const createBook = (data) => api.post("/api/books", data);
export const updateBook = (id, data) => api.put(`/api/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/api/books/${id}`);

// Categories (read-only)
export const getCategories = () => api.get("/api/categories");
export const getCategoryById = (id) => api.get(`/api/categories/${id}`);
