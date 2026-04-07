import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/reducers/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // unwrap() nos permite usar try/catch con createAsyncThunk
      const resultAction = await dispatch(
        loginUser({ email, password }),
      ).unwrap();

      alert(`Bienvenido, ${resultAction.email} (Rol: ${resultAction.rol})`);
      navigate("/catalogo");
    } catch (error) {
      alert(error || "Credenciales inválidas");
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
