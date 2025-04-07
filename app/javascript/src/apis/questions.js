import axios from "axios";

const fetch = quizSlug =>
  axios.get("questions", { params: { quiz_slug: quizSlug } });

const show = (questionId, quizSlug) =>
  axios.get(`questions/${questionId}`, {
    params: { quiz_slug: quizSlug },
  });

const create = (quizSlug, payload) =>
  axios.post(`questions`, { question: payload, quiz_slug: quizSlug });

const update = (questionId, quizSlug, payload) =>
  axios.put(`questions/${questionId}`, {
    question: payload,
    quizSlug,
  });

const destroy = (questionId, quizSlug) =>
  axios.delete(`questions/${questionId}`, { params: { quiz_slug: quizSlug } });

const clone = questionId => axios.post(`questions/${questionId}/clone`);

const questionsApi = {
  fetch,
  show,
  create,
  update,
  destroy,
  clone,
};

export default questionsApi;
