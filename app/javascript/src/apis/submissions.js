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

const generatePdf = slug =>
  axios.post("/submissions/report", {
    submission: { slug, timezone: browserTimeZone() },
  });

const downloadPdf = () =>
  axios.get("/submissions/report/download", { responseType: "blob" });

const submissionsApi = { fetch, generatePdf, downloadPdf };

export default submissionsApi;
