import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

const Catalogo = () => (
  <div>
    <h2>Catálogo de GameStore</h2>
    <p>Inventario en construcción...</p>
  </div>
);

const App = () => {
  return (
    <div className="app-container">
      <header>
        <h1>🎮 GameStore</h1>
        <nav style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Registro</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/catalogo" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalogo" element={<Catalogo />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
