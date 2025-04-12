import React from "react";

import { useSignup } from "hooks/reactQuery/useAuthApi";
import { t } from "i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import withTitle from "utils/withTitle";

import SignupForm from "./Form/Signup";

const Signup = () => {
  const history = useHistory();

  const { mutate: signup, isLoading } = useSignup();

  const handleSubmit = values => {
    signup(values, {
      onSuccess: () => history.push("/admin/login"),
    });
  };

  return (
    <div className="w-full">
      <SignupForm
        handleSubmit={handleSubmit}
        loading={isLoading}
        initialValues={{
          username: "",
          email: "",
          password: "",
          password_confirmation: "",
        }}
      />
    </div>
  );
};

export default withTitle(Signup, t("title.signup"));
