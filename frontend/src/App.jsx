import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { initAuth, logout } from "./redux/reducers/authSlice";
import Login from "./components/Login";
import Register from "./components/Register";
import Catalogo from "./components/Catalogo";
import UserList from "./components/UserList";
import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(initAuth()); // Recupera la sesión al montar la app
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="app-container">
      <header>
        <h1>🎮 GameStore</h1>
        <nav
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "10px",
            alignItems: "center",
          }}
        >
          <Link to="/catalogo">Catálogo</Link>

          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Registro</Link>
            </>
          ) : (
            <>
              {user.rol === "ESTANDAR" && (
                <Link
                  to="/mi-lista"
                  style={{ fontWeight: "bold", color: "#f39c12" }}
                >
                  ⭐ Mi Lista
                </Link>
              )}

              <span style={{ fontSize: "0.8em", color: "#666" }}>
                ({user.email})
              </span>
              <button
                onClick={handleLogout}
                style={{ padding: "2px 8px", cursor: "pointer" }}
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </nav>
      </header>

      <main style={{ marginTop: "20px" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/catalogo" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route
            path="/mi-lista"
            element={user ? <UserList /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
