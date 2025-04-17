import React, { useState, useEffect, useRef } from "react";

import classnames from "classnames";
import { useFetchQuestions } from "hooks/reactQuery/useQuestionsApi";
import { useShowQuiz } from "hooks/reactQuery/useQuizzesApi";
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

  const { data: quiz } = useShowQuiz(slug);

  const { data: { questions: questionResponse = [] } = {}, error } =
    useFetchQuestions(slug);

  const { mutate: updateSubmission } = useUpdateSubmission();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const userAnswersRef = useRef([]);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    if (questionResponse.length > 0 && userAnswersRef.current.length === 0) {
      const initialAnswers = questionResponse.map(question => ({
        questionId: question.id,
        selectedOptionIndex: null,
      }));
      userAnswersRef.current = initialAnswers;
      setUserAnswers(initialAnswers);
    }
  }, [questionResponse]);

  const timeLimitMins = quiz?.timeLimit || 0;
  const [remainingTime, setRemainingTime] = useState(timeLimitMins * 60);

  const formatHHMMSS = secs => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    if (timeLimitMins <= 0) return;
    const key = `quizStartTime_${slug}`;
    let start = parseInt(sessionStorage.getItem(key), 10);
    if (!start) {
      start = Date.now();
      sessionStorage.setItem(key, start);
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const rem = timeLimitMins * 60 - elapsed;
      setRemainingTime(rem > 0 ? rem : 0);
      if (rem <= 0) {
        clearInterval(timerId);
        handleSubmission();
      }
    };

    tick();
    const timerId = setInterval(tick, 1000);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(timerId);
  }, [timeLimitMins, slug]);

  const handleAnswerSelect = optionIndex => {
    const newAnswers = [...userAnswersRef.current];
    newAnswers[currentQuestionIndex] = {
      questionId: questionResponse[currentQuestionIndex]?.id,
      selectedOptionIndex: optionIndex,
    };
    userAnswersRef.current = newAnswers;
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
            answers: userAnswersRef.current,
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
            answers: userAnswersRef.current,
            status: "completed",
          },
        },
        {
          onSuccess: () => {
            history.replace({
              pathname: buildRoute(
                routes.public.quizzes.result,
                slug,
                null,
                userId
              ),
              state: {
                answers: userAnswersRef.current,
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
    <>
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
      {timeLimitMins > 0 && (
        <div
          className={classnames(
            "fixed right-4 top-4 rounded-lg px-3 py-1 shadow",
            {
              "bg-red-100 text-red-600": remainingTime <= 5 * 60,
              "bg-white text-gray-800": remainingTime > 5 * 60,
            }
          )}
        >
          <span className="font-medium">{formatHHMMSS(remainingTime)}</span>
        </div>
      )}
    </>
  );
};

export default withTitle(QuizAttempt, t("title.quizAttempt"));
