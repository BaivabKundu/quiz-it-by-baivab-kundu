import axios from "axios";

const fetch = (slug, { searchKey, page, filters }) =>
  axios.get("/submissions", {
    params: {
      slug,
      searchKey,
      page,
      filters,
    },
  });

const submissionsApi = { fetch };

export default submissionsApi;
