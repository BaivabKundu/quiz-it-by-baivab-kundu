import axios from "axios";

const fetch = quizSlug =>
  axios.get("questions", { params: { quiz_slug: quizSlug } });

const show = (questionId, quizSlug) =>
  axios.get(`questions/${questionId}`, {
    params: { quiz_slug: quizSlug },
  });

const create = (quizSlug, payload) =>
  axios.post(`questions`, { question: payload, quiz_slug: quizSlug });

const update = (questionId, payload) =>
  axios.put(`questions/${questionId}`, { question: payload });

const destroy = questionId => axios.delete(`questions/${questionId}`);

const questionsApi = {
  fetch,
  show,
  create,
  update,
  destroy,
};

export default questionsApi;
