import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyList, removeFromList } from "../redux/reducers/userListSlice";

const UserList = () => {
  const dispatch = useDispatch();
  const { items: miLista, loading } = useSelector((state) => state.userList);

  useEffect(() => {
    // Cuando el componente se monta, traemos la lista desde la API
    dispatch(fetchMyList());
  }, [dispatch]);

  const handleRemove = async (id) => {
    try {
      await dispatch(removeFromList(id)).unwrap();
    } catch (error) {
      alert(error);
    }
  };

  if (loading) return <p>Cargando tu lista...</p>;

  return (
    <div>
      <h2>Mi Lista Personal</h2>
      {miLista.length === 0 ? (
        <p>Tu lista está vacía.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "15px",
          }}
        >
          {miLista.map((juego) => (
            <div
              key={juego.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#fff",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0" }}>{juego.titulo}</h4>
              <p
                style={{
                  margin: "0 0 15px 0",
                  fontSize: "0.9em",
                  color: "#27ae60",
                  fontWeight: "bold",
                }}
              >
                Precio: {juego.precio} €
              </p>
              <button
                onClick={() => handleRemove(juego.id)}
                style={{
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  width: "100%",
                }}
              >
                Quitar de mi lista
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
