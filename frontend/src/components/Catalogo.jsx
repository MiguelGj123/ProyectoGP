import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchVideogames,
  addVideogame,
  editVideogame,
  deleteVideogame,
} from "../redux/reducers/videogamesSlice";
import { addToList } from "../redux/reducers/userListSlice";

import SearchBar from "./SearchBar";
import Pagination from "./Pagination";

const Catalogo = () => {
  // Inicializamos el hook dispatch que pedía el linter
  const dispatch = useDispatch();

  // Extraemos los estados directamente de Redux
  const { items: juegos, loading } = useSelector((state) => state.videogames);
  const user = useSelector((state) => state.auth.user);

  // Estado local solo para el control de la UI (formulario)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    genero: "",
    precio: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    // Al montar, pedimos a Redux que traiga el catálogo
    dispatch(fetchVideogames());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await dispatch(
          editVideogame({ id: editId, gameData: formData }),
        ).unwrap();
        alert("Videojuego actualizado con éxito");
      } else {
        await dispatch(addVideogame(formData)).unwrap();
        alert("Videojuego añadido con éxito");
      }
      setFormData({ titulo: "", descripcion: "", genero: "", precio: "" });
      setEditId(null);
    } catch (error) {
      alert(error || "Error en la operación");
    }
  };

  const handleEditClick = (juego) => {
    setFormData({
      titulo: juego.titulo,
      descripcion: juego.descripcion,
      genero: juego.genero,
      precio: juego.precio || "",
    });
    setEditId(juego.id);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este videojuego?")
    ) {
      try {
        await dispatch(deleteVideogame(id)).unwrap();
      } catch (error) {
        alert(error || "Error al eliminar");
      }
    }
  };

  if (loading) return <p>Cargando inventario...</p>;

  return (
    <div>
      <h2>Catálogo de GameStore</h2>
      <SearchBar />
      {user?.rol === "ADMIN" && (
        <div
          style={{
            background: "#e8f4f8",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3>{editId ? "Editar Videojuego" : "Añadir Nuevo Videojuego"}</h3>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
          >
            <input
              name="titulo"
              placeholder="Título"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
            <input
              name="descripcion"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
            <input
              name="genero"
              placeholder="Género"
              value={formData.genero}
              onChange={handleChange}
              required
            />
            <input
              name="precio"
              type="number"
              step="0.01"
              placeholder="Precio"
              value={formData.precio}
              onChange={handleChange}
              required
            />
            <button type="submit">
              {editId ? "Guardar Cambios" : "Añadir"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setFormData({
                    titulo: "",
                    descripcion: "",
                    genero: "",
                    precio: "",
                  });
                }}
              >
                Cancelar
              </button>
            )}
          </form>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {juegos.map((juego) => (
          <div
            key={juego.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>{juego.titulo}</h3>
            <p style={{ fontSize: "0.9em" }}>{juego.descripcion}</p>
            <div
              style={{
                marginTop: "15px",
                borderTop: "1px solid #eee",
                paddingTop: "10px",
              }}
            >
              <span style={{ display: "block" }}>
                <strong>Género:</strong> {juego.genero}
              </span>
              <span
                style={{
                  display: "block",
                  color: "#27ae60",
                  fontWeight: "bold",
                }}
              >
                Precio: {juego.precio} €
              </span>
            </div>

            {user?.rol === "ESTANDAR" && (
              <button
                style={{ marginTop: "10px", width: "100%" }}
                onClick={async () => {
                  try {
                    // ¡Aquí usamos el dispatch correctamente!
                    await dispatch(addToList(juego.id)).unwrap();
                    alert("¡Guardado en tu lista!");
                  } catch (e) {
                    alert(e || "Ya está en tu lista o hubo un error");
                  }
                }}
              >
                ⭐ Guardar en mi lista
              </button>
            )}

            {user?.rol === "ADMIN" && (
              <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleEditClick(juego)}
                  style={{
                    background: "#f39c12",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(juego.id)}
                  style={{
                    background: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Borrar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <Pagination />
    </div>
  );
};

export default Catalogo;
