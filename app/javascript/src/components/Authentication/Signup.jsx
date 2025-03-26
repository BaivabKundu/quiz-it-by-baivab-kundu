import React, { useState } from "react";

import authApi from "apis/auth";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import SignupForm from "./Form/Signup";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async values => {
    setLoading(true);
    await authApi.signup({
      username: values.username,
      email: values.email,
      password: values.password,
      password_confirmation: values.password_confirmation,
    });
    setLoading(false);
    history.push("/dashboard");
  };

  return (
    <SignupForm
      handleSubmit={handleSubmit}
      loading={loading}
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
