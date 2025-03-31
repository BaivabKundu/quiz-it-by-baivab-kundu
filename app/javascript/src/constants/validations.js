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

export const filterSchema = yup.object().shape({
  name: yup.string(),
  assignedCategoryName: yup.array().of(
    yup.object().shape({
      value: yup.string(),
    })
  ),
  status: yup.object().shape({
    value: yup.string(),
  }),
});

export const newQuizSchema = yup.object().shape({
  name: yup
    .string()
    .required(t("quiz.validations.nameRequired"))
    .min(2, t("quiz.validations.nameMinLength"))
    .max(100, t("quiz.validations.nameMaxLength")),
  assignedCategory: yup
    .object()
    .shape({
      label: yup.string().required(t("quiz.validations.categoryRequired")),
      value: yup.string().required(t("quiz.validations.categoryRequired")),
    })
    .required(t("quiz.validations.categoryRequired")),
});
