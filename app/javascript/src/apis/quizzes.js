import axios from "axios";

const fetch = params => axios.get("quizzes", { params });

const show = slug => axios.get(`quizzes/${slug}`);

const create = payload => axios.post("quizzes", { quiz: payload });

const update = (slug, payload) =>
  axios.put(`quizzes/${slug}`, { quiz: payload });

const destroy = slug => axios.delete(`quizzes/${slug}`);

const clone = slug => axios.post(`quizzes/${slug}/clone`);

const bulkUpdate = ({ id, update_fields }) =>
  axios.put("quizzes/bulk_update", {
    quizzes: { id, update_fields },
  });

const bulkDelete = ({ id }) =>
  axios.delete("quizzes/bulk_destroy", {
    data: { quizzes: { id } },
  });

const quizzesApi = {
  fetch,
  show,
  create,
  update,
  destroy,
  clone,
  bulkUpdate,
  bulkDelete,
};

export default quizzesApi;
