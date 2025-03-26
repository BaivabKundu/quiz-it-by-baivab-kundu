import React, { useState } from "react";

import authApi from "apis/auth";
import { setAuthHeaders } from "apis/axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { setToLocalStorage } from "utils/storage";

import LoginForm from "./Form/Login";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async values => {
    setLoading(true);
    const response = await authApi.login({
      email: values.email,
      password: values.password,
    });

    setToLocalStorage({
      authToken: response.authenticationToken,
      email: values.email.toLowerCase(),
      userId: response.id,
      userName: response.username,
    });
    setAuthHeaders();
    history.push("/dashboard");
    setLoading(false);
  };

  return (
    <LoginForm
      handleSubmit={handleSubmit}
      loading={loading}
      initialValues={{
        email: "",
        password: "",
      }}
    />
  );
};

export default Login;
