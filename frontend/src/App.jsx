import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import BooksPage from "./pages/BooksPage";

function App() {
  const [page, setPage] = useState("books");

  return (
    <div className="app-layout">
      <Sidebar page={page} setPage={setPage} />
      <main className="app-main">
        {page === "books" && <BooksPage />}
      </main>
    </div>
  );
}

export default App;
