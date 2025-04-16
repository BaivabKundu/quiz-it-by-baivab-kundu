import axios from "axios";
import { browserTimeZone } from "utils/browserTimeZone";

const fetch = ({ ...payload }) =>
  axios.get("/submissions", {
    params: payload,
  });

const create = payload =>
  axios.post("/submissions", {
    submission: payload,
  });

const update = (id, { ...payload }) =>
  axios.put(`/submissions/${id}`, {
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
