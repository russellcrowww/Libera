import "./App.css";
import Sidebar from "./components/Sidebar";
import BooksPage from "./pages/BooksPage";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <BooksPage />
      </main>
    </div>
  );
}

export default App;
