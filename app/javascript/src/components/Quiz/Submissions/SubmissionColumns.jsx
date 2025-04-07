import React from "react";

import { Tag } from "@bigbinary/neetoui";
import { format } from "date-fns";

export const getSubmissionColumns = () => [
  {
    dataIndex: "name",
    key: "name",
    title: "Name",
    width: 250,
  },
  {
    dataIndex: "email",
    key: "email",
    title: "Email",
    width: 200,
  },
  {
    dataIndex: "createdAt",
    key: "createdAt",
    title: "Submissions date",
    width: 200,
    render: date => format(new Date(date), "dd MMMM yyyy"),
  },
  {
    dataIndex: "correctAnswersCount",
    key: "correctAnswersCount",
    title: "Correct answers",
    width: 200,
  },
  {
    dataIndex: "wrongAnswersCount",
    key: "wrongAnswersCount",
    title: "Wrong answers",
    width: 200,
  },
  {
    dataIndex: "unansweredCount",
    key: "unansweredCount",
    title: "Unanswered",
    width: 200,
  },
  {
    dataIndex: "totalQuestions",
    key: "totalQuestions",
    title: "Questions",
    width: 200,
  },
  {
    dataIndex: "status",
    key: "status",
    title: "Status",
    width: 150,
    render: status => {
      status = status === "completed" ? "Completed" : "Incomplete";

      return (
        <Tag
          label={status}
          style={status === "Completed" ? "primary" : "warning"}
        />
      );
    },
  },
];
