import React, { useState } from "react";

import {
  useUpdateOrganization,
  useFetchOrganization,
} from "hooks/reactQuery/useOrganizationsApi";
import { t } from "i18next";
import { Typography, Button } from "neetoui";
import { Input, Form as NeetoUIForm } from "neetoui/formik";
import withTitle from "utils/withTitle";

import { generalSettingsSchema } from "./constants";
import Navbar from "./Navbar";

import ErrorPageLayout from "../commons/ErrorPageLayout";
import PageLoader from "../commons/PageLoader";

const GeneralSettings = () => {
  const [activeTab, setActiveTab] = useState("general");

  const {
    data: { organization } = {},
    isLoading: isOrganizationLoading,
    error,
  } = useFetchOrganization();

  const { mutate: updateOrganization } = useUpdateOrganization();

  const handleSubmit = (values, { resetForm }) => {
    updateOrganization(
      { id: organization?.id, payload: { name: values.name } },
      {
        onSuccess: () => {
          resetForm({ values });
        },
      }
    );
  };

  if (isOrganizationLoading) return <PageLoader />;

  const initialValues = {
    name: organization?.name,
  };

  if (error) {
    return <ErrorPageLayout status={error.response.status} />;
  }

  return (
    <div className="ml-16 flex min-h-screen w-full flex-col bg-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="m-32">
        <Typography className="mb-1 text-4xl font-semibold">
          {t("labels.settings.heading")}
        </Typography>
        <Typography className="text-md mb-8 font-medium">
          {t("labels.settings.subheading")}
        </Typography>
        <NeetoUIForm
          formikProps={{
            initialValues,
            validationSchema: generalSettingsSchema,
            onSubmit: handleSubmit,
          }}
        >
          {({ dirty, resetForm }) => (
            <div className="w-96">
              <div className="space-y-2">
                <Typography>{t("labels.settings.quizTitle")}</Typography>
                <Input
                  required
                  name="name"
                  placeholder={t("inputPlaceholders.quizTitleInput")}
                  size="large"
                />
                <div className="flex space-x-4">
                  <Button
                    className="w-full justify-center bg-blue-500 px-4 py-3"
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
              </div>
            </div>
          )}
        </NeetoUIForm>
      </div>
    </div>
  );
};

export default withTitle(GeneralSettings, t("title.generalSettings"));
