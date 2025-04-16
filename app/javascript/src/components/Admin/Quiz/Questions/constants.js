import { t } from "i18next";
import * as yup from "yup";

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
  uniqueOptions: yup
    .boolean()
    .test(
      "unique-options",
      t("quiz.validations.duplicateOptions"),
      value => value === true
    ),
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
