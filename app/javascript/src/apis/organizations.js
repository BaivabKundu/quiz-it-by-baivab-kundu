import axios from "axios";

const fetch = () => axios.get("organizations");

const show = () => axios.get("organizations");

const update = payload => axios.put("organizations", { organization: payload });

const organizationsApi = {
  fetch,
  show,
  update,
};

export default organizationsApi;
