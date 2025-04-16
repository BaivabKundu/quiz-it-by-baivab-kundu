import React, { useState } from "react";

import { useFetchQuestions } from "hooks/reactQuery/useQuestionsApi";
import { useUpdateSubmission } from "hooks/reactQuery/useSubmissionsApi";
import { t } from "i18next";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";
import { getPublicUserFromLocalStorage } from "utils/storage";
import { buildRoute } from "utils/url";
import withTitle from "utils/withTitle";

import ShowQuestion from "./ShowQuestion";

import ErrorPageLayout from "../../Admin/commons/ErrorPageLayout";

const QuizAttempt = () => {
  const history = useHistory();

  const { slug } = useParams();

  const userId = getPublicUserFromLocalStorage();

  const { data: { questions: questionResponse = [] } = {}, error } =
    useFetchQuestions(slug);

  const { mutate: updateSubmission } = useUpdateSubmission();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    questionResponse.map(question => ({
      questionId: question.id,
      selectedOptionIndex: null,
    }))
  );

  const handleAnswerSelect = optionIndex => {
    const newAnswers = [...userAnswers];
    const currentQuestionId = questionResponse[currentQuestionIndex]?.id;
    newAnswers[currentQuestionIndex] = {
      questionId: currentQuestionId,
      selectedOptionIndex: optionIndex,
    };
    setUserAnswers(newAnswers);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionResponse.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const submissionId = sessionStorage.getItem("submissionId");
      if (submissionId) {
        updateSubmission({
          id: submissionId,
          payload: {
            slug,
            answers: userAnswers,
            status: "incomplete",
          },
        });
      }
    }
  };

  const handleSubmission = () => {
    const submissionId = sessionStorage.getItem("submissionId");
    if (submissionId) {
      updateSubmission(
        {
          id: submissionId,
          payload: {
            slug,
            answers: userAnswers,
            status: "completed",
          },
        },
        {
          onSuccess: () => {
            localStorage.removeItem("publicUser");
            history.replace({
              pathname: buildRoute(routes.public.quizzes.result, slug, userId),
              state: {
                answers: userAnswers,
                questions: questionResponse,
              },
            });
          },
        }
      );
    }
  };

  if (error) {
    return <ErrorPageLayout status={error.response.status} />;
  }

  return (
    <ShowQuestion
      currentQuestionIndex={currentQuestionIndex}
      options={questionResponse[currentQuestionIndex]?.options}
      question={questionResponse[currentQuestionIndex]?.body}
      selectedAnswer={userAnswers[currentQuestionIndex]}
      totalQuestions={questionResponse.length}
      onAnswerSelect={handleAnswerSelect}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onSubmit={handleSubmission}
    />
  );
};

export default withTitle(QuizAttempt, t("title.quizAttempt"));
