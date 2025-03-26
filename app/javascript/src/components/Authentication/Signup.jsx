import React from "react";

import { useSignup } from "hooks/reactQuery/useAuthApi";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import SignupForm from "./Form/Signup";

const Signup = () => {
  const history = useHistory();

  const { mutate: signup, isLoading } = useSignup();

  const handleSubmit = values => {
    signup(values, {
      onSuccess: () => history.push("/dashboard"),
    });
  };

  return (
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
  );
};

export default Signup;
