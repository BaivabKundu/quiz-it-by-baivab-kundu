import axios from "axios";

const fetch = () => axios.get("quizzes");

const show = slug => axios.get(`quizzes/${slug}`);

const create = payload => axios.post("quizzes", { quiz: payload });

const update = (slug, payload) =>
  axios.put(`quizzes/${slug}`, { quiz: payload });

const destroy = slug => axios.delete(`quizzes/${slug}`);

const quizzesApi = {
  fetch,
  show,
  create,
  update,
  destroy,
};

export default quizzesApi;
