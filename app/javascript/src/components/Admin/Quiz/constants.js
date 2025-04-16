import { t } from "i18next";
import * as yup from "yup";

export const DEFAULT_PAGE_INDEX = 1;

export const columns = [
  {
    dataIndex: "name",
    key: "name",
    title: t("labels.table.name"),
    isHidable: false,
  },
  { dataIndex: "category", key: "category", title: t("labels.table.category") },
  {
    dataIndex: "submissionsCount",
    key: "submissionsCount",
    title: t("labels.table.submissionsCount"),
  },
  {
    dataIndex: "createdAt",
    key: "createdAt",
    title: t("labels.table.createdOn"),
  },
  {
    dataIndex: "status",
    key: "status",
    title: t("labels.table.status"),
  },
];

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
    .min(5, t("quiz.validations.nameMinLength"))
    .max(50, t("quiz.validations.nameMaxLength")),
  assignedCategory: yup
    .object()
    .nullable()
    .required(t("quiz.validations.categoryRequired"))
    .shape({
      label: yup.string().required(t("quiz.validations.categoryRequired")),
      value: yup.string().required(t("quiz.validations.categoryRequired")),
      id: yup.string().required(t("quiz.validations.categoryRequired")),
    }),
});

export const newQuizInitialValues = {
  name: "",
  assignedCategory: null,
};

export const filterInitialValues = {
  name: "",
  selectedCategories: [],
  status: "",
};
