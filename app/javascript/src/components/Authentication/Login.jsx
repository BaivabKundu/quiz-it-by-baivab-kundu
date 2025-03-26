import React from "react";

import LoginForm from "./Form/Login";

const Login = () => {
  // const [loading, setLoading] = useState(false);

  const handleSubmit = () => {};

  return (
    <LoginForm
      handleSubmit={handleSubmit}
      // loading={loading}
      initialValues={{
        email: "",
        password: "",
      }}
    />
  );
};

export default Login;
