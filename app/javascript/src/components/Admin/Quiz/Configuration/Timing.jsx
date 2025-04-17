import React, { useState } from "react";

import ToggleFeatureCard from "@bigbinary/neeto-molecules/ToggleFeatureCard";
import { Button, Typography } from "@bigbinary/neetoui";
import { Form, Input } from "@bigbinary/neetoui/formik";
import { useUpdateQuiz, useShowQuiz } from "hooks/reactQuery/useQuizzesApi";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import { quizTimingSchema } from "./constants";

import PageLoader from "../../commons/PageLoader";
import Navbar from "../Navbar";

const Timing = () => {
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
          timeLimit: parseInt(values.hours) * 60 + parseInt(values.minutes),
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
          <Typography className="text-md">Configure / Quiz timing</Typography>
        </div>
        <div className="mb-8 flex items-center">
          <Typography className="text-2xl font-semibold">
            Quiz timing
          </Typography>
        </div>
        <div className="ml-16">
          <Form
            formikProps={{
              initialValues: {
                timing: quiz?.timeLimit !== 0,
                hours: 0,
                minutes: 1,
              },
              validationSchema: quizTimingSchema,
              onSubmit: handleSubmit,
            }}
          >
            {({ dirty, resetForm, values }) => (
              <>
                <ToggleFeatureCard
                  className="p-5"
                  description="Set a time limit for candidates to complete the quiz."
                  switchName="timing"
                  title="Add timer for the entire quiz"
                >
                  <div className="flex w-2/3 space-x-4">
                    <Input
                      className="w-1/2"
                      disabled={!values.timing}
                      label="Hours"
                      min={0}
                      name="hours"
                      type="number"
                    />
                    <Input
                      className="w-1/2"
                      disabled={!values.timing}
                      label="Minutes"
                      max={59}
                      min={1}
                      name="minutes"
                      type="number"
                    />
                  </div>
                </ToggleFeatureCard>
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

export default Timing;
