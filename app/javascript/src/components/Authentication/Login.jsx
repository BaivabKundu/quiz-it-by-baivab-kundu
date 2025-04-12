import React from "react";

import { useLogin } from "hooks/reactQuery/useAuthApi";
import { t } from "i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import withTitle from "utils/withTitle";

import LoginForm from "./Form/Login";

const Login = () => {
  const history = useHistory();

  const { mutate: login, isLoading } = useLogin();

  const handleSubmit = values => {
    login(values, {
      onSuccess: () => history.push("/admin/dashboard"),
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

export default withTitle(Login, t("title.login"));
