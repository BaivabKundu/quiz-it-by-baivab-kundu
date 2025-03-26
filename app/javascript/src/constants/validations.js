import { t } from "i18next";
import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .required(t("auth.validations.emailRequired"))
    .email(t("auth.validations.emailInvalid")),
  password: yup
    .string()
    .required(t("auth.validations.passwordRequired"))
    .min(8, t("auth.validations.passwordMinLength")),
});

export const signupSchema = yup.object({
  username: yup
    .string()
    .required(t("auth.validations.nameRequired"))
    .min(2, t("auth.validations.nameMinLength"))
    .max(50, t("auth.validations.nameMaxLength")),
  email: yup
    .string()
    .required(t("auth.validations.emailRequired"))
    .email(t("auth.validations.emailInvalid")),
  password: yup
    .string()
    .required(t("auth.validations.passwordRequired"))
    .min(8, t("auth.validations.passwordMinLength")),
  password_confirmation: yup
    .string()
    .required(t("auth.validations.passwordConfirmationRequired"))
    .oneOf(
      [yup.ref("password"), null],
      t("auth.validations.passwordsMustMatch")
    ),
});
