import React from "react";

import { LeftArrow } from "@bigbinary/neeto-icons";
import { Button, Typography } from "@bigbinary/neetoui";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";
import withTitle from "utils/withTitle";

import ShowQuestionResult from "./ShowQuestionResult";

const QuizResult = () => {
  const location = useLocation();

  const { t } = useTranslation();

  const questions = location.state?.questions;
  const answers = location.state?.answers;
  const correctAnswers = questions.map(question => ({
    questionId: question.id,
    correctOptionId: question.options.findIndex(option => option.isCorrect),
  }));

  const totalQuestions = questions.length;

  const correctCount = answers.filter(answer => {
    if (!answer) return false;

    const correctAnswer = correctAnswers.find(
      question => question.questionId === answer.questionId
    );

    return (
      correctAnswer &&
      answer.selectedOptionIndex === correctAnswer.correctOptionId
    );
  }).length;

  const incorrectCount = answers.filter(answer => {
    if (!answer || answer.selectedOptionIndex === null) return false;

    const correctAnswer = correctAnswers.find(
      question => question.questionId === answer.questionId
    );

    return (
      correctAnswer &&
      answer.selectedOptionIndex !== correctAnswer.correctOptionId
    );
  }).length;

  const unansweredCount = totalQuestions - correctCount - incorrectCount;

  localStorage.removeItem("publicUser");

  return (
    <div className="mx-auto w-full overflow-y-auto p-6">
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <Typography className="mb-12 text-center text-4xl font-bold">
            {t("labels.quizResultPage.heading")}
          </Typography>
          <div className="mb-6 flex items-center justify-between">
            <Button
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
              icon={LeftArrow}
              iconPosition="left"
              to={routes.public.dashboard}
            >
              {t("labels.buttons.home")}
            </Button>
            <div className="text-gray-600">
              {t("labels.quizResultPage.totalQuestions", {
                count: totalQuestions,
              })}
            </div>
          </div>
          <hr className="my-6 border-gray-200" />
          <div className="mb-12 grid grid-cols-4 gap-4">
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <Typography className="mb-2 text-gray-600">
                {t("labels.quizResultPage.score")}
              </Typography>
              <Typography className="text-4xl font-bold">
                {correctCount}/{totalQuestions}
              </Typography>
            </div>
            <div className="rounded-lg bg-green-50 p-6 text-center">
              <Typography className="mb-2 text-green-600">
                {t("labels.quizResultPage.correct").charAt(0).toUpperCase() +
                  t("labels.quizResultPage.correct").slice(1)}
              </Typography>
              <Typography className="text-4xl font-bold">
                {correctCount}
              </Typography>
            </div>
            <div className="rounded-lg bg-red-50 p-6 text-center">
              <Typography className="mb-2 text-red-600">
                {t("labels.quizResultPage.incorrect").charAt(0).toUpperCase() +
                  t("labels.quizResultPage.incorrect").slice(1)}
              </Typography>
              <Typography className="text-4xl font-bold">
                {incorrectCount}
              </Typography>
            </div>
            <div className="rounded-lg bg-gray-100 p-6 text-center">
              <Typography className="mb-2 text-gray-600">
                {t("labels.quizResultPage.unanswered")}
              </Typography>
              <Typography className="text-4xl font-bold">
                {unansweredCount}
              </Typography>
            </div>
          </div>
          <div className="space-y-8">
            {questions.map((question, qIndex) => {
              const userAnswer =
                answers?.find(answer => answer?.questionId === question?.id) ||
                undefined;

              const correctAnswer = correctAnswers.find(
                correct => correct.questionId === question.id
              );

              return (
                <ShowQuestionResult
                  correctAnswer={correctAnswer}
                  key={qIndex}
                  question={question}
                  questionIndex={qIndex}
                  userAnswer={userAnswer}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTitle(QuizResult, t("title.quizResult"));
