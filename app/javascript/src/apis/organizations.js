import axios from "axios";

const fetch = () => axios.get("organizations");

const show = () => axios.get("organizations");

const update = (id, payload) =>
  axios.put(`organizations/${id}`, { organization: payload });

const organizationsApi = {
  fetch,
  show,
  update,
};

export default organizationsApi;
