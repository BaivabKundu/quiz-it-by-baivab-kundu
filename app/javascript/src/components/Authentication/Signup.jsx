import React from "react";

import SignupForm from "./Form/Signup";

const Signup = () => {
  // const [loading, setLoading] = useState(false);

  const handleSubmit = () => {};

  return (
    <SignupForm
      handleSubmit={handleSubmit}
      // loading={loading}
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
