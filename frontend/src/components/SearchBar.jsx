import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchVideogames, setFilters } from "../redux/reducers/videogamesSlice";

const SearchBar = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [genero, setGenero] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search, genero }));
    dispatch(fetchVideogames());
  };

  const handleReset = () => {
    setSearch("");
    setGenero("");
    dispatch(setFilters({ search: "", genero: "" }));
    dispatch(fetchVideogames());
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        background: "#f9f9f9",
        padding: "15px",
        borderRadius: "8px",
      }}
    >
      <input
        type="text"
        placeholder="Buscar por título..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ flex: 1 }}
      />
      <input
        type="text"
        placeholder="Filtrar por género..."
        value={genero}
        onChange={(e) => setGenero(e.target.value)}
        style={{ flex: 1 }}
      />
      <button
        type="submit"
        style={{
          background: "#3498db",
          color: "#fff",
          border: "none",
          padding: "8px 15px",
          borderRadius: "4px",
        }}
      >
        Buscar
      </button>
      <button
        type="button"
        onClick={handleReset}
        style={{
          background: "#95a5a6",
          color: "#fff",
          border: "none",
          padding: "8px 15px",
          borderRadius: "4px",
        }}
      >
        Limpiar
      </button>
    </form>
  );
};

export default SearchBar;
