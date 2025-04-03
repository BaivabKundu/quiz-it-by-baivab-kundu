import React, { useState, useEffect } from "react";

import { ExternalLink, LeftArrow } from "@bigbinary/neeto-icons";
import Rename from "@bigbinary/neeto-molecules/Rename";
import { Button, Typography } from "@bigbinary/neetoui";
import dayjs from "dayjs";
import { useShowQuiz, useUpdateQuiz } from "hooks/reactQuery/useQuizzesApi";
import {
  Link,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";

const Navbar = ({
  activeTab,
  setActiveTab,
  handleQuizPublish,
  quizStatus,
  quizUpdatedAt,
}) => {
  const { slug } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [draftSavedAt, setDraftSavedAt] = useState(null);

  const { data: quiz } = useShowQuiz(slug);
  const { mutate: updateQuiz } = useUpdateQuiz();

  const quizName = quiz?.name;

  const handleRename = values => {
    updateQuiz({
      slug,
      payload: { name: values },
    });
  };

  useEffect(() => {
    if (quizStatus === "draft") {
      setDraftSavedAt(quizUpdatedAt);
    }
  }, [quizStatus, quizUpdatedAt]);

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex w-full items-center">
        <div className="flex min-w-fit items-center font-medium text-gray-700">
          <Link onClick={() => history.goBack()}>
            <LeftArrow className="mx-4 h-7 w-7 rounded-full p-1 transition-all duration-200 hover:bg-gray-300 " />
          </Link>
          <Typography style="h4">
            <Rename
              hideMenu
              allowEmptySubmission={false}
              placeholder="Enter quiz name"
              value={quizName}
              onRename={handleRename}
            />
          </Typography>
        </div>
        <div className="flex flex-1 justify-center">
          <div className="flex items-center space-x-4 border-gray-200">
            <Link
              to={`/quizzes/${slug}/questions`}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "questions" &&
                location.pathname.split("/").pop() === "questions"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 "
              }`}
              onClick={() => setActiveTab("questions")}
            >
              Questions
            </Link>
            <Link
              to={`/quizzes/${slug}/submissions`}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "submissions"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 "
              }`}
              onClick={() => setActiveTab("submissions")}
            >
              Submissions
            </Link>
          </div>
        </div>
        <div className="flex w-96 justify-end">
          {quizStatus === "draft" && draftSavedAt && (
            <Typography className="mr-2 flex items-center text-sm text-gray-500">
              Draft saved at{" "}
              {dayjs(draftSavedAt).format("h:mm A, D MMMM YYYY ")}
            </Typography>
          )}
          <Button
            className="mx-1 rounded-r-none bg-blue-600"
            label={quizStatus === "published" ? "Draft" : "Publish"}
            onClick={() => handleQuizPublish(slug)}
          />
          <Button className="rounded-l-none bg-blue-600" icon={ExternalLink} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
