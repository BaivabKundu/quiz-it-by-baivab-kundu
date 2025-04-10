import { registrationSchema } from "constants/validations";

import React from "react";

import { Typography, Button } from "@bigbinary/neetoui";
import { Input, Form as NeetoUIForm } from "@bigbinary/neetoui/formik";
import { useRegister } from "hooks/reactQuery/useAuthApi";
import { useCreateSubmission } from "hooks/reactQuery/useSubmissionsApi";
import { useTranslation } from "react-i18next";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { getPublicUserFromLocalStorage } from "utils/storage";

const Register = () => {
  const initialValues = {
    username: "",
    email: "",
  };

  const { slug } = useParams();

  const { t } = useTranslation();

  const history = useHistory();

  const { mutate: register, isLoading } = useRegister();

  const { mutate: createSubmission } = useCreateSubmission();

  const handleSubmit = ({ username, email }) => {
    register(
      { username, email },
      {
        onSuccess: () => {
          history.push(`/quizzes/${slug}/attempt`);
          const userAnswers = [];
          const userId = getPublicUserFromLocalStorage();
          createSubmission({
            slug,
            userId,
            userAnswers,
            status: "incomplete",
          });
        },
      }
    );
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-gray-50
    px-4 py-12 sm:px-6 lg:px-8 "
    >
      <div className="w-full max-w-md">
        <Typography
          className="mt-6 text-center text-3xl font-extrabold
        leading-9 text-gray-700"
        >
          Quiz registration
        </Typography>
        <NeetoUIForm
          formikProps={{
            initialValues,
            validationSchema: registrationSchema,
            onSubmit: handleSubmit,
          }}
        >
          <div className="w-full">
            <div className="space-y-2">
              <Typography>{t("labels.name")}</Typography>
              <Input
                required
                name="username"
                placeholder={t("auth.placeholders.name")}
                size="medium"
              />
              <Typography>{t("labels.email")}</Typography>
              <Input
                required
                name="email"
                placeholder={t("auth.placeholders.email")}
                size="medium"
              />
              <Button
                className="w-full justify-center bg-blue-500 px-4 py-3"
                label={t("auth.signIn")}
                loading={isLoading}
                type="submit"
              />
            </div>
          </div>
        </NeetoUIForm>
      </div>
    </div>
  );
};

export default Register;
