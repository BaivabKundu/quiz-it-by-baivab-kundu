import React from "react";

import { Check, Close } from "@bigbinary/neeto-icons";
import { Button } from "@bigbinary/neetoui";
import { Form, Input } from "@bigbinary/neetoui/formik";
import {
  useCreateRedirection,
  useUpdateRedirection,
} from "hooks/reactQuery/useRedirectionsApi";
import { useTranslation } from "react-i18next";
import { prefixUrl } from "utils/url";

import {
  BASE_URL,
  redirectionFormInitialValues,
  redirectionFormSchema,
} from "./constants";

const UrlForm = ({ onClose, id, mode, initialValues }) => {
  const { mutate: createRedirection } = useCreateRedirection();
  const { mutate: updateRedirection } = useUpdateRedirection();

  const { t } = useTranslation();

  const handleCreateOrUpdateRedirection = ({ source, destination }) => {
    const payload = {
      source: prefixUrl(source, BASE_URL, true),
      destination: prefixUrl(destination, BASE_URL),
    };

    if (mode === "edit") {
      updateRedirection({ id, payload }, { onSuccess: () => onClose() });
    } else {
      createRedirection(payload, { onSuccess: () => onClose() });
    }
  };

  return (
    <Form
      formikProps={{
        initialValues: initialValues || redirectionFormInitialValues,
        validationSchema: redirectionFormSchema,
        onSubmit: handleCreateOrUpdateRedirection,
      }}
    >
      {({ dirty }) => (
        <div className="mb-6 grid grid-cols-5 items-center gap-4 rounded border border-gray-200 p-4">
          <div className="col-span-2">
            <Input
              nakedInput
              className="w-full rounded border border-gray-300 p-2"
              name="source"
              placeholder={t("inputPlaceholders.sourceUrl")}
              type="text"
            />
          </div>
          <div className="col-span-2">
            <Input
              nakedInput
              className="w-full rounded border border-gray-300 p-2"
              name="destination"
              placeholder={t("inputPlaceholders.destinationUrl")}
              type="text"
            />
          </div>
          <div className="col-span-1 flex justify-end space-x-2">
            <Button
              className="rounded-full border border-gray-200 p-1 text-green-500"
              disabled={!dirty}
              style="text"
              type="submit"
            >
              <Check />
            </Button>
            <Button
              className="rounded-full border border-gray-200 p-1 text-red-500"
              style="text"
              onClick={() => onClose()}
            >
              <Close />
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
};

export default UrlForm;
