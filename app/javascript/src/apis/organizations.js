import axios from "axios";

const show = () => axios.get("organizations");

const update = payload => axios.put("organizations", { organization: payload });

const organizationsApi = {
  show,
  update,
};

export default organizationsApi;
