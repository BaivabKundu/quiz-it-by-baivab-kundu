import { t } from "i18next";
import * as yup from "yup";

export const generalSettingsSchema = yup.object({
  name: yup
    .string()
    .required(t("settings.validations.quizTitleRequired"))
    .min(2, t("settings.validations.minQuizTitleLength"))
    .max(100, t("settings.validations.maxQuizTitleLength")),
});
