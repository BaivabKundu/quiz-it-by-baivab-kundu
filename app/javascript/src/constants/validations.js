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
  selectedCategories: yup.array().of(
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

export const questionSchema = yup.object().shape({
  question: yup
    .string()
    .required(t("quiz.validations.questionRequired"))
    .min(5, t("quiz.validations.questionMinLength")),
  correctOptionId: yup
    .number()
    .typeError(t("quiz.validations.correctAnswerRequired"))
    .required(t("quiz.validations.correctAnswerRequired"))
    .moreThan(0, t("quiz.validations.correctAnswerRequired")),
  options: yup
    .array()
    .of(
      yup.object().shape({
        text: yup.string().required(t("quiz.validations.optionRequired")),
        isCorrect: yup.boolean(),
      })
    )
    .min(2, t("quiz.validations.minOptionsRequired"))
    .test(
      "has-correct-answer",
      t("quiz.validations.correctAnswerRequired"),
      options => options.some(option => option.isCorrect)
    )
    .test("unique-options", t("quiz.validations.duplicateOptions"), options => {
      const texts = options.map(option => option.text);

      return new Set(texts).size === texts.length;
    }),
});
