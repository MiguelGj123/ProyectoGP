import { useDispatch, useSelector } from "react-redux";
import { fetchVideogames, setPage } from "../redux/reducers/videogamesSlice";

const Pagination = () => {
  const dispatch = useDispatch();
  const { currentPage, totalPages } = useSelector((state) => state.videogames);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
      dispatch(fetchVideogames());
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
        marginTop: "30px",
        marginBottom: "20px",
      }}
    >
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        style={{
          padding: "8px 15px",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}
      >
        Anterior
      </button>
      <span style={{ fontWeight: "bold" }}>
        Página {currentPage} de {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        style={{
          padding: "8px 15px",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
