import React from "react";

import { useLogin } from "hooks/reactQuery/useAuthApi";
import { t } from "i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";
import { getFromLocalStorage } from "utils/storage";
import withTitle from "utils/withTitle";

import { loginInitialValues } from "./constants";
import LoginForm from "./Form/Login";

const Login = () => {
  const history = useHistory();

  const { mutate: login, isLoading } = useLogin();

  const authToken = getFromLocalStorage("authToken");

  if (authToken) history.replace(routes.admin.dashboard);

  const handleSubmit = values => {
    login(values, {
      onSuccess: () => history.push(routes.admin.dashboard),
    });
  };

  return (
    <div className="w-full">
      <LoginForm
        handleSubmit={handleSubmit}
        initialValues={loginInitialValues}
        loading={isLoading}
      />
    </div>
  );
};

export default withTitle(Login, t("title.login"));
