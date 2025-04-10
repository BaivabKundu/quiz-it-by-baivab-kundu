import axios from "axios";
import { browserTimeZone } from "utils/browserTimeZone";

const fetch = (slug, { searchKey, page, filters }) =>
  axios.get("/submissions", {
    params: {
      slug,
      searchKey,
      page,
      filters,
    },
  });

const create = (slug, userId, userAnswers, status) =>
  axios.post("/submissions", {
    slug,
    user_id: userId,
    answers: userAnswers,
    status,
  });

const update = (id, slug, payload) =>
  axios.put(`/submissions/${id}`, {
    slug,
    submission: payload,
  });

const generatePdf = slug =>
  axios.post("/submissions/report", {
    submission: { slug, timezone: browserTimeZone() },
  });

const downloadPdf = () =>
  axios.get("/submissions/report/download", { responseType: "blob" });

const submissionsApi = { fetch, create, update, generatePdf, downloadPdf };

export default submissionsApi;
