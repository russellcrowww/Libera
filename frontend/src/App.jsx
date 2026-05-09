import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import BooksPage from "./pages/BooksPage";
import CategoriesPage from "./pages/CategoriesPage";
import AddBookModal from "./components/AddBookModal";
import AddCategoryModal from "./components/AddCategoryModal";

function App() {
  const [page, setPage] = useState("books");
  const [modal, setModal] = useState(null); // "addBook" | "addCategory"
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="app-layout">
      <Sidebar page={page} setPage={setPage} />
      <main className="app-main">
        {page === "books" && (
          <BooksPage
            key={refreshKey}
            onAddBook={() => setModal("addBook")}
          />
        )}
        {page === "categories" && (
          <CategoriesPage
            key={refreshKey}
            onAddCategory={() => setModal("addCategory")}
          />
        )}
      </main>

      {modal === "addBook" && (
        <AddBookModal
          onClose={() => setModal(null)}
          onCreated={refresh}
        />
      )}
      {modal === "addCategory" && (
        <AddCategoryModal
          onClose={() => setModal(null)}
          onCreated={refresh}
        />
      )}
    </div>
  );
}

export default App;
