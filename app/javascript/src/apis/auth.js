import axios from "axios";

const login = payload =>
  axios.post("session", {
    login: payload,
  });

const signup = payload =>
  axios.post("users", {
    user: payload,
  });

const logout = () => axios.delete("session");

const register = payload =>
  axios.post("users/create_standard_user", {
    user: payload,
  });

const authApi = {
  login,
  signup,
  logout,
  register,
};

export default authApi;
