import axios from "axios";
import { keysToCamelCase, serializeKeysToSnakeCase } from "neetocist";
import { Toastr } from "neetoui";
import { evolve } from "ramda";
import { setToLocalStorage, getFromLocalStorage } from "utils/storage";

const DEFAULT_ERROR_NOTIFICATION = "Something went wrong!";
const setDefaultParams = () => {
  axios.defaults.baseURL = "/api/v1";
};

const setAuthHeaders = () => {
  axios.defaults.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-CSRF-TOKEN": document
      .querySelector('[name="csrf-token"]')
      .getAttribute("content"),
  };
  const token = getFromLocalStorage("authToken");
  const email = getFromLocalStorage("authEmail");
  if (token && email) {
    axios.defaults.headers["X-Auth-Email"] = email;
    axios.defaults.headers["X-Auth-Token"] = token;
  }
};

const transformResponseKeysToCamelCase = response => {
  if (response.data && !(response.data instanceof Blob)) {
    response.data = keysToCamelCase(response.data);
  }
};

const handleSuccessResponse = response => {
  if (response) {
    response.success = response.status === 200;
    if (response.data.notice) {
      Toastr.success(response.data.notice);
    }
  }
  transformResponseKeysToCamelCase(response);

  return response.data;
};

const handleErrorResponse = axiosErrorObject => {
  if (axiosErrorObject.response?.status === 401) {
    setToLocalStorage({ authToken: null, email: null, userId: null });
  }

  Toastr.error(
    axiosErrorObject.response?.data?.error || DEFAULT_ERROR_NOTIFICATION,
    {
      autoClose: 2000,
    }
  );

  return Promise.reject(axiosErrorObject);
};

const requestInterceptors = () => {
  axios.interceptors.request.use(
    evolve({ data: serializeKeysToSnakeCase, params: serializeKeysToSnakeCase })
  );
};

const responseInterceptors = () => {
  axios.interceptors.response.use(handleSuccessResponse, error =>
    handleErrorResponse(error)
  );
};

const registerIntercepts = () => {
  requestInterceptors();
  responseInterceptors();
};

const resetAuthTokens = () => {
  delete axios.defaults.headers["X-Auth-Email"];
  delete axios.defaults.headers["X-Auth-Token"];
};

export {
  setAuthHeaders,
  registerIntercepts,
  resetAuthTokens,
  setDefaultParams,
};
