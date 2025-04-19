import { t } from "i18next";
import * as yup from "yup";

export const BASE_URL = "http://localhost:3000";

export const redirectionFormInitialValues = {
  source: "",
  destination: "",
};

export const redirectionFormSchema = yup.object().shape({
  source: yup.string().required(t("settings.validations.sourceUrlRequired")),
  destination: yup
    .string()
    .required("settings.validations.destinationUrlRequired"),
});
