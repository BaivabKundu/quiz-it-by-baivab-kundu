import React from "react";

import { Tag } from "@bigbinary/neetoui";
import dayjs from "dayjs";
import { t } from "i18next";

export const getSubmissionColumns = () => [
  {
    dataIndex: "name",
    key: "name",
    title: t("labels.table.name"),
    width: 250,
  },
  {
    dataIndex: "email",
    key: "email",
    title: t("labels.table.email"),
    width: 200,
  },
  {
    dataIndex: "createdAt",
    key: "createdAt",
    title: t("labels.table.submissionsDate"),
    width: 200,
    render: date => dayjs(date).format("h:mm A, D MMMM YYYY "),
  },
  {
    dataIndex: "correctAnswersCount",
    key: "correctAnswersCount",
    title: t("labels.table.correctAnswers"),
    width: 200,
  },
  {
    dataIndex: "wrongAnswersCount",
    key: "wrongAnswersCount",
    title: t("labels.table.wrongAnswers"),
    width: 200,
  },
  {
    dataIndex: "unansweredCount",
    key: "unansweredCount",
    title: t("labels.table.unanswered"),
    width: 200,
  },
  {
    dataIndex: "totalQuestions",
    key: "totalQuestions",
    title: t("labels.table.questions"),
    width: 200,
  },
  {
    dataIndex: "status",
    key: "status",
    title: t("labels.table.status"),
    width: 150,
    render: status => {
      status =
        status === "completed"
          ? t("labels.table.completedStatus")
          : t("labels.table.incompleteStatus");

      return (
        <Tag
          label={status}
          style={
            status === t("labels.table.completedStatus") ? "primary" : "warning"
          }
        />
      );
    },
  },
];
