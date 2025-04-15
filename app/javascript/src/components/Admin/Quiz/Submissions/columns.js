import { t } from "i18next";

import { getSubmissionColumns } from "./SubmissionColumns";

export const submissionColumns = getSubmissionColumns();

export const columns = [
  {
    dataIndex: "name",
    key: "name",
    title: t("labels.table.name"),
  },
  {
    dataIndex: "email",
    key: "email",
    title: t("labels.table.email"),
  },
  {
    dataIndex: "createdAt",
    key: "createdAt",
    title: t("labels.table.submissionsDate"),
  },
  {
    dataIndex: "correctAnswersCount",
    key: "correctAnswersCount",
    title: t("labels.table.correctAnswers"),
  },
  {
    dataIndex: "wrongAnswersCount",
    key: "wrongAnswersCount",
    title: t("labels.table.wrongAnswers"),
  },
  {
    dataIndex: "unansweredCount",
    key: "unansweredCount",
    title: t("labels.table.unanswered"),
  },
  {
    dataIndex: "totalQuestions",
    key: "totalQuestions",
    title: t("labels.table.questions"),
  },
  {
    dataIndex: "status",
    key: "status",
    title: t("labels.table.status"),
  },
];

export const filterColumns = [
  {
    key: "name",
    label: t("labels.table.name"),
    type: "text",
    node: "name",
  },
  {
    key: "email",
    label: t("labels.table.email"),
    type: "text",
    node: "email",
  },
  {
    key: "status",
    label: t("labels.table.status"),
    type: "multiSelect",
    node: "status",
    values: [
      {
        label: "Completed",
        value: "Completed",
      },
      {
        label: "Incomplete",
        value: "Incomplete",
      },
    ],
  },
];
