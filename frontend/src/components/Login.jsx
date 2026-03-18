import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.login({ email, password });
      window.localStorage.setItem("gameStoreUser", JSON.stringify(user));
      alert(`Bienvenido, ${user.email} (Rol: ${user.rol})`);
      navigate("/catalogo"); // Redirección automática
    } catch (error) {
      alert(error.response?.data?.error?.[0] || "Credenciales inválidas");
    }
  };

  return (
    <div>
      <h2>Identificación</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
