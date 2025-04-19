import axios from "axios";

const fetch = () => axios.get("redirections");

const create = payload => axios.post("redirections", { redirection: payload });

const update = (id, payload) =>
  axios.put(`redirections/${id}`, { redirection: payload });

const destroy = id => axios.delete(`redirections/${id}`);

const redirectionsApi = {
  fetch,
  create,
  update,
  destroy,
};

export default redirectionsApi;
