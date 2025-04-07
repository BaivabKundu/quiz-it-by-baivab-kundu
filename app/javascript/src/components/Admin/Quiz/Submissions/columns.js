import { getSubmissionColumns } from "./SubmissionColumns";

export const submissionColumns = getSubmissionColumns();

export const columns = [
  {
    dataIndex: "name",
    key: "name",
    title: "Name",
  },
  {
    dataIndex: "email",
    key: "email",
    title: "Email",
  },
  {
    dataIndex: "createdAt",
    key: "createdAt",
    title: "Submissions date",
  },
  {
    dataIndex: "correctAnswersCount",
    key: "correctAnswersCount",
    title: "Correct answers",
  },
  {
    dataIndex: "wrongAnswersCount",
    key: "wrongAnswersCount",
    title: "Wrong answers",
  },
  {
    dataIndex: "unansweredCount",
    key: "unansweredCount",
    title: "Unanswered",
  },
  {
    dataIndex: "totalQuestions",
    key: "totalQuestions",
    title: "Questions",
  },
  {
    dataIndex: "status",
    key: "status",
    title: "Status",
  },
];

export const filterColumns = [
  {
    key: "name",
    label: "Name",
    type: "text",
    node: "name",
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    node: "email",
  },
  {
    key: "status",
    label: "Status",
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
