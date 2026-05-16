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

export const getBooks = () => api.get("/api/books");
export const getBooksFiltered = (params) => api.get("/api/books", { params });
export const createBook = (data) => api.post("/api/books", data);
export const updateBook = (id, data) => api.put(`/api/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/api/books/${id}`);

export const getCategories = () => api.get("/api/categories");
export const createCategory = (data) => api.post("/api/categories", data);
