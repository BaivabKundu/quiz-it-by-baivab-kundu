import { generalSettingSchema } from "constants/validations";

import React from "react";

import { Typography, Button } from "@bigbinary/neetoui";
import { Input, Form as NeetoUIForm } from "@bigbinary/neetoui/formik";
import {
  useUpdateOrganization,
  useFetchOrganization,
} from "hooks/reactQuery/useOrganizationsApi";
import { t } from "i18next";
import withTitle from "utils/withTitle";

const GeneralSettings = () => {
  const { data: { organization } = {} } = useFetchOrganization();
  const { mutate: updateOrganization } = useUpdateOrganization();
  const handleSubmit = ({ name }) => {
    updateOrganization({ id: organization?.id, payload: { name } });
  };

  const initialValues = {
    name: organization?.name,
  };

  return (
    <div className="m-32">
      <Typography className="mb-1 text-4xl font-bold">
        {t("labels.settings.heading")}
      </Typography>
      <Typography className="mb-8 text-gray-600">
        {t("labels.settings.subheading")}
      </Typography>
      <NeetoUIForm
        formikProps={{
          initialValues,
          validationSchema: generalSettingSchema,
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
  );
};

export default withTitle(GeneralSettings, t("title.generalSettings"));
