import React, { useState } from "react";

import { useFetchQuestions } from "hooks/reactQuery/useQuestionsApi";
import { useUpdateSubmission } from "hooks/reactQuery/useSubmissionsApi";
import { t } from "i18next";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { getPublicUserFromLocalStorage } from "utils/storage";
import withTitle from "utils/withTitle";

import ShowQuestion from "./ShowQuestion";

const QuizAttempt = () => {
  const history = useHistory();

  const { slug } = useParams();

  const userId = getPublicUserFromLocalStorage();

  const { data: { questions: questionResponse = [] } = {} } =
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
          slug,
          payload: {
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
          slug,
          payload: {
            answers: userAnswers,
            status: "completed",
          },
        },
        {
          onSuccess: () => {
            localStorage.clear();
            history.replace({
              pathname: `/quizzes/${slug}/${userId}/result`,
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
