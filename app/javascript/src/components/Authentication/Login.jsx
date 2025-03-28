import React from "react";

import { useLogin } from "hooks/reactQuery/useAuthApi";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import LoginForm from "./Form/Login";

const Login = () => {
  const history = useHistory();

  const { mutate: login, isLoading } = useLogin();

  const handleSubmit = values => {
    login(values, {
      onSuccess: () => history.push("/dashboard"),
    });
  };

  return (
    <div className="w-full">
      <LoginForm
        handleSubmit={handleSubmit}
        loading={isLoading}
        initialValues={{
          email: "",
          password: "",
        }}
      />
    </div>
  );
};

export default Login;
