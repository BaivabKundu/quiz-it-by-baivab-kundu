import { loginSchema } from "constants/validations";

import React from "react";

import { Button, Typography } from "@bigbinary/neetoui";
import { Input, Form as NeetoUIForm } from "@bigbinary/neetoui/formik";
import { t } from "i18next";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Login = ({ handleSubmit, initialValues, loading }) => (
  <div
    className="flex min-h-screen items-center justify-center bg-gray-50
    px-4 py-12 sm:px-6 lg:px-8 "
  >
    <div className="w-full max-w-md">
      <Typography
        className="mt-6 text-center text-3xl font-extrabold
        leading-9 text-gray-700"
      >
        {t("auth.signIn")}
      </Typography>
      <div className="text-center">
        <Link
          to="/signup"
          className=" mt-2 text-center text-sm font-medium
            text-blue-400 transition duration-150 ease-in-out
            focus:underline focus:outline-none"
        >
          <Typography>{t("auth.register")}</Typography>
        </Link>
      </div>
      <NeetoUIForm
        formikProps={{
          initialValues,
          validationSchema: loginSchema,
          onSubmit: values => handleSubmit(values),
        }}
      >
        <div className="w-full">
          <div className="space-y-2">
            <Typography>{t("labels.email")}</Typography>
            <Input
              required
              name="email"
              placeholder={t("auth.placeholders.email")}
              size="medium"
            />
            <Typography>{t("labels.password")}</Typography>
            <Input
              required
              name="password"
              placeholder={t("auth.placeholders.password")}
              size="medium"
              type="password"
            />
            <Button
              className="w-full justify-center bg-blue-500 px-4 py-3"
              label={t("auth.signIn")}
              loading={loading}
              type="submit"
            />
          </div>
        </div>
      </NeetoUIForm>
    </div>
  </div>
);

export default Login;
