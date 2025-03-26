import { signupSchema } from "constants/validations";

import React from "react";

import { Button, Typography } from "@bigbinary/neetoui";
import { Input, Form as NeetoUIForm } from "@bigbinary/neetoui/formik";
import { Link } from "react-router-dom";

const Signup = ({ handleSubmit, initialValues, loading }) => (
  <div
    className="flex min-h-screen items-center justify-center bg-gray-50
      px-4 py-12 sm:px-6 lg:px-8 "
  >
    <div className="w-full max-w-md">
      <Typography
        className="mt-6 text-center text-3xl font-extrabold
          leading-9 text-gray-700"
      >
        Sign up
      </Typography>
      <div className="text-center">
        <Link
          to="/login"
          className="mt-2 text-center text-sm font-medium
              text-blue-500 transition duration-150 ease-in-out
              focus:underline focus:outline-none"
        >
          <Typography>Or login now</Typography>
        </Link>
      </div>
      <NeetoUIForm
        formikProps={{
          initialValues,
          validationSchema: signupSchema,
          onSubmit: values => handleSubmit(values),
        }}
      >
        <div className="w-full">
          <div className="space-y-2">
            <Typography>Name</Typography>
            <Input
              required
              name="username"
              placeholder="Enter name"
              size="medium"
            />
            <Typography>Email</Typography>
            <Input
              required
              name="email"
              placeholder="Enter email"
              size="medium"
            />
            <Typography>Password</Typography>
            <Input
              required
              name="password"
              placeholder="********"
              size="medium"
              type="password"
            />
            <Typography>Password confirmation</Typography>
            <Input
              required
              name="password_confirmation"
              placeholder="********"
              size="medium"
              type="password"
            />
            <Button
              className="w-full justify-center bg-blue-500 px-4 py-3"
              label="Sign up"
              loading={loading}
              type="submit"
            />
          </div>
        </div>
      </NeetoUIForm>
    </div>
  </div>
);

export default Signup;
