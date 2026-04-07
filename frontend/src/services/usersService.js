import axios from "axios";

// Corregido: la ruta en el backend (users.js) era /api/users/list
const baseUrl = "/api/users/list";

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const getMyList = async (token) => {
  const response = await axios.get(baseUrl, getConfig(token));
  return response.data;
};

const addToList = async (videojuegoId, token) => {
  const response = await axios.post(
    baseUrl,
    { videojuegoId },
    getConfig(token),
  );
  return response.data;
};

const removeFromList = async (id, token) => {
  await axios.delete(`${baseUrl}/${id}`, getConfig(token));
};

export default { getMyList, addToList, removeFromList };
