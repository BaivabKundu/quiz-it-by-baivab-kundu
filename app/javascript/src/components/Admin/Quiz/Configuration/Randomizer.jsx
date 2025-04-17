import React, { useState } from "react";

import ToggleFeatureCard from "@bigbinary/neeto-molecules/ToggleFeatureCard";
import { Button, Typography } from "@bigbinary/neetoui";
import { Form } from "@bigbinary/neetoui/formik";
import { useUpdateQuiz, useShowQuiz } from "hooks/reactQuery/useQuizzesApi";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import PageLoader from "../../commons/PageLoader";
import Navbar from "../Navbar";

const Randomizer = () => {
  const [activeTab, setActiveTab] = useState("configuration");

  const { t } = useTranslation();

  const { slug } = useParams();

  const { data: quiz, isLoading: isQuizLoading } = useShowQuiz(slug);
  const { mutate: updateQuiz } = useUpdateQuiz();

  const handleSubmit = (values, { resetForm }) => {
    updateQuiz(
      {
        slug,
        payload: {
          randomizeChoices: values.randomizeChoices,
          randomizeQuestions: values.randomizeQuestions,
        },
      },
      {
        onSuccess: () => {
          resetForm({ values });
        },
      }
    );
  };

  if (isQuizLoading) return <PageLoader />;

  return (
    <div className="ml-16 w-full">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mx-auto mt-20 w-2/3 px-4 py-8">
        <div className="text-md mb-4 flex items-center text-gray-500">
          <Typography className="text-md">
            Configure / Questions and options
          </Typography>
        </div>
        <div className="mb-8 flex items-center">
          <Typography className="text-2xl font-semibold">
            Questions and options
          </Typography>
        </div>
        <div className="ml-16">
          <Form
            formikProps={{
              initialValues: {
                randomizeChoices: quiz?.randomizeChoices,
                randomizeQuestions: quiz?.randomizeQuestions,
              },
              onSubmit: handleSubmit,
            }}
          >
            {({ dirty, resetForm }) => (
              <>
                <ToggleFeatureCard
                  className="p-5"
                  description="Choices shown will be randomly shuffled each time a new candidate takes the quiz."
                  switchName="randomizeChoices"
                  title="Randomize choices"
                />
                <ToggleFeatureCard
                  className="mt-5 p-5"
                  description="Questions shown will be randomly shuffled each time a new candidate takes the quiz"
                  switchName="randomizeQuestions"
                  title="Randomize questions"
                />
                <div className="mt-5 flex w-2/3 space-x-4">
                  <Button
                    className="w-full justify-center bg-blue-500 px-2 py-3"
                    disabled={!dirty}
                    label={t("labels.buttons.saveChanges")}
                    type="submit"
                  />
                  <Button
                    className="w-full justify-center"
                    label={t("labels.buttons.cancel")}
                    style="text"
                    onClick={() => resetForm()}
                  />
                </div>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Randomizer;
