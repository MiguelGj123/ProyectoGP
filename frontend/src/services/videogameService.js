import axios from "axios";

const baseUrl = "/api/videogames";

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const getAll = async (filters = {}) => {
  const { search, genero, page = 1 } = filters;
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (genero) params.append("genero", genero);
  params.append("page", page);

  const response = await axios.get(`${baseUrl}?${params.toString()}`);
  return response.data; // Ahora devuelve { items, totalPages, currentPage }
};

const create = async (newObject, token) => {
  const response = await axios.post(baseUrl, newObject, getConfig(token));
  return response.data;
};

const update = async (id, newObject, token) => {
  const response = await axios.put(
    `${baseUrl}/${id}`,
    newObject,
    getConfig(token),
  );
  return response.data;
};

const remove = async (id, token) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfig(token));
  return response.data;
};

export default { getAll, create, update, remove };
