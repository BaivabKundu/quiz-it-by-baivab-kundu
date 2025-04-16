import React, { useState, useEffect } from "react";

import {
  ExternalLink,
  LeftArrow,
  Link as NeetoLinkIcon,
} from "@bigbinary/neeto-icons";
import Rename from "@bigbinary/neeto-molecules/Rename";
import { Button, Typography, Tab } from "@bigbinary/neetoui";
import dayjs from "dayjs";
import { useShowQuiz, useUpdateQuiz } from "hooks/reactQuery/useQuizzesApi";
import { Toastr } from "neetoui";
import { useTranslation, Trans } from "react-i18next";
import {
  Link,
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";
import { buildRoute } from "utils/url";

const Navbar = ({ activeTab, setActiveTab }) => {
  const { slug } = useParams();
  const history = useHistory();
  const location = useLocation();

  const { data: quiz } = useShowQuiz(slug);
  const { mutate: updateQuiz } = useUpdateQuiz();

  const [draftSavedAt, setDraftSavedAt] = useState("");

  const { t } = useTranslation();

  const currentQuizStatus = quiz?.status;

  const quizName = quiz?.name;

  const handleRename = values => {
    updateQuiz({
      slug,
      payload: { name: values },
    });
  };

  const handleQuizPublish = slug => {
    updateQuiz({
      slug,
      payload: {
        status: currentQuizStatus === "published" ? "draft" : "published",
      },
    });
  };

  const handleBackNavigation = () => {
    if (
      location.pathname.includes("new") ||
      location.pathname.includes("edit")
    ) {
      history.push(buildRoute(routes.admin.quizzes.questions, slug));
    } else {
      history.push(routes.admin.dashboard);
    }
  };

  useEffect(() => {
    setDraftSavedAt(quiz?.updatedAt);
  }, [quiz, quiz?.status, quiz?.updatedAt]);

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex w-full items-center">
        <div className="flex min-w-fit items-center font-medium text-gray-700">
          <Link onClick={handleBackNavigation}>
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
            <Tab size="small">
              <Tab.Item
                active={activeTab === "questions"}
                onClick={() => {
                  setActiveTab("questions");
                  history.push(
                    buildRoute(routes.admin.quizzes.questions, slug)
                  );
                }}
              >
                {t("labels.questions")}
              </Tab.Item>
              <Tab.Item
                active={activeTab === "submissions"}
                onClick={() => {
                  setActiveTab("questions");
                  history.push(
                    buildRoute(routes.admin.quizzes.submissions, slug)
                  );
                }}
              >
                {t("labels.submissions")}
              </Tab.Item>
            </Tab>
          </div>
        </div>
        <div className="flex w-96 items-center justify-end">
          {!location.pathname.includes("new") &&
            !location.pathname.includes("edit") &&
            !location.pathname.includes("submissions") && (
              <div className="flex items-center">
                {currentQuizStatus === "draft" &&
                  quiz?.questionsCount !== 0 && (
                    <Typography className="mr-2 flex items-center text-sm text-gray-500">
                      <Trans
                        components={{ span: <span /> }}
                        i18nKey="labels.draftTime"
                        values={{
                          time: dayjs(draftSavedAt).format(
                            "h:mm A, D MMMM YYYY "
                          ),
                        }}
                      />
                    </Typography>
                  )}
                <Button
                  className="mx-1 rounded-r-none bg-blue-600"
                  disabled={
                    currentQuizStatus === "published" ||
                    quiz?.questionsCount === 0
                  }
                  label={
                    currentQuizStatus === "published"
                      ? t("labels.buttons.published")
                      : t("labels.buttons.publish")
                  }
                  onClick={() => handleQuizPublish(slug)}
                />
                <Button
                  className="mr-2 rounded-l-none bg-blue-600"
                  disabled={currentQuizStatus === "draft"}
                  icon={ExternalLink}
                  target="_blank"
                  to={`/quizzes/${slug}/register`}
                />
                <Button
                  disabled={currentQuizStatus === "draft"}
                  style="text"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}${buildRoute(
                        routes.public.quizzes.register,
                        slug
                      )}`
                    );
                    Toastr.success("Link copied to clipboard!");
                  }}
                >
                  <NeetoLinkIcon className="h-5 w-5" />
                </Button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
