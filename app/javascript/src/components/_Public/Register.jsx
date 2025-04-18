import React from "react";

import { Typography, Button } from "@bigbinary/neetoui";
import { Input, Form as NeetoUIForm } from "@bigbinary/neetoui/formik";
import { useRegister } from "hooks/reactQuery/useAuthApi";
import { useShowQuiz } from "hooks/reactQuery/useQuizzesApi";
import { useCreateSubmission } from "hooks/reactQuery/useSubmissionsApi";
import { t } from "i18next";
import { useTranslation, Trans } from "react-i18next";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";
import { getPublicUserFromLocalStorage } from "utils/storage";
import { buildRoute } from "utils/url";
import withTitle from "utils/withTitle";

import { registrationInitialValues, registrationSchema } from "./constants";

import ErrorPageLayout from "../Admin/commons/ErrorPageLayout";

const Register = () => {
  const { slug } = useParams();

  const { data: quiz, error } = useShowQuiz(slug);

  const { t } = useTranslation();

  const history = useHistory();

  const { mutate: register, isLoading } = useRegister();

  const { mutate: createSubmission } = useCreateSubmission();

  if (quiz?.status === "draft") {
    history.push("/");

    return null;
  }

  const handleSubmit = ({ username, email }) => {
    register(
      { username, email },
      {
        onSuccess: () => {
          history.push(buildRoute(routes.public.quizzes.attempt, slug));
          const userAnswers = [];
          const userId = getPublicUserFromLocalStorage();
          createSubmission({
            slug,
            userId,
            answers: userAnswers,
            status: "incomplete",
          });
        },
      }
    );
  };

  if (error) {
    return <ErrorPageLayout status={error.response.status} />;
  }

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
          <Trans
            components={{ strong: <strong /> }}
            i18nKey="labels.publicRegistrationPage.heading"
            values={{ quizName: quiz?.name }}
          />
        </Typography>
        <Typography className="text-md my-2 text-center">
          <Trans
            components={{ strong: <strong /> }}
            i18nKey="labels.publicRegistrationPage.subheading"
            values={{ quizName: quiz?.name }}
          />
        </Typography>
        <NeetoUIForm
          formikProps={{
            initialValues: registrationInitialValues,
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

export default withTitle(Register, t("title.register"));
