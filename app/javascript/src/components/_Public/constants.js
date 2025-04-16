import { t } from "i18next";
import * as yup from "yup";

export const registrationSchema = yup.object({
  username: yup
    .string()
    .required(t("auth.validations.nameRequired"))
    .min(2, t("auth.validations.nameMinLength"))
    .max(50, t("auth.validations.nameMaxLength")),
  email: yup
    .string()
    .required(t("auth.validations.emailRequired"))
    .email(t("auth.validations.emailInvalid")),
});

export const registrationInitialValues = {
  username: "",
  email: "",
};
