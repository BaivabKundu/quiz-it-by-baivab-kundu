import { generalSettingSchema } from "constants/validations";

import React from "react";

import { Typography, Button } from "@bigbinary/neetoui";
import { Input, Form as NeetoUIForm } from "@bigbinary/neetoui/formik";
import { useUpdateOrganization } from "hooks/reactQuery/useOrganizationsApi";

const GeneralSettings = () => {
  const initialValues = {
    name: "",
  };

  const { mutate: updateOrganization } = useUpdateOrganization();

  const handleSubmit = ({ name }, { resetForm }) => {
    updateOrganization({ name }, { onSuccess: () => resetForm() });
  };

  return (
    <div className="m-32">
      <Typography className="mb-1 text-4xl font-bold">
        General Settings
      </Typography>
      <Typography className="mb-8 text-gray-600">
        Customise the quiz site name
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
              <Typography>Quiz title</Typography>
              <Input
                required
                name="name"
                placeholder="Enter the quiz title"
                size="large"
              />
              <div className="flex space-x-4">
                <Button
                  className="w-full justify-center bg-blue-500 px-4 py-3"
                  disabled={!dirty}
                  label="Save changes"
                  type="submit"
                />
                <Button
                  className="w-full justify-center"
                  label="Cancel"
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

export default GeneralSettings;
