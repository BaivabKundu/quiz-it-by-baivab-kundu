import React from "react";

import { CheckCircle, CloseCircle } from "@bigbinary/neeto-icons";
import { Typography } from "@bigbinary/neetoui";
import classNames from "classnames";
import { useTranslation, Trans } from "react-i18next";

const ShowQuestionResult = ({
  question,
  userAnswer,
  correctAnswer,
  questionIndex,
}) => {
  const isAnswered =
    userAnswer?.selectedOptionIndex !== null && userAnswer !== undefined;

  const isCorrect =
    isAnswered &&
    userAnswer.selectedOptionIndex === correctAnswer?.correctOptionId;

  const { t } = useTranslation();

  return (
    <div className="w-full">
      <Typography className="mb-1 text-lg text-gray-600">
        {t("labels.quizResultPage.questionNumber", {
          questionIndex: questionIndex + 1,
        })}
      </Typography>
      <Typography className="mb-4 text-2xl font-bold">
        <Trans
          components={{ strong: <strong /> }}
          i18nKey="labels.quizResultPage.question"
          values={{ question: question.body }}
        />
      </Typography>
      <div className="space-y-3">
        {question.options.map((option, oIndex) => {
          let optionStyle = "border border-gray-200 bg-white";
          let iconComponent = (
            <div className="mr-3 flex h-6 w-6 items-center justify-center">
              <CheckCircle />
            </div>
          );
          let rightLabel = "";

          if (userAnswer?.selectedOptionIndex === oIndex && isCorrect) {
            optionStyle = "border-2 border-green-500 bg-green-50";
            iconComponent = (
              <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                <CheckCircle />
              </div>
            );
            rightLabel = t("labels.quizResultPage.userAnswer");
          } else if (userAnswer?.selectedOptionIndex === oIndex && !isCorrect) {
            optionStyle = "border-2 border-red-500 bg-white";
            iconComponent = (
              <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                <CloseCircle />
              </div>
            );
            rightLabel = t("labels.quizResultPage.userAnswer");
          } else if (correctAnswer?.correctOptionId === oIndex) {
            optionStyle = "border border-gray-200 bg-white";
            iconComponent = (
              <div className="mr-3 flex h-6 w-6 items-center justify-center">
                <CheckCircle />
              </div>
            );
            rightLabel = t("labels.quizResultPage.correctAnswer");
          }

          return (
            <div
              className={`flex items-center justify-between rounded-lg p-4 ${optionStyle}`}
              key={oIndex}
            >
              <div className="flex items-center">
                {iconComponent}
                <Typography>{option.text}</Typography>
              </div>
              {rightLabel && (
                <Typography
                  className={classNames({
                    "text-red-500":
                      userAnswer?.selectedOptionIndex === oIndex && !isCorrect,
                    "text-green-500": !(
                      userAnswer?.selectedOptionIndex === oIndex && !isCorrect
                    ),
                  })}
                >
                  {rightLabel}
                </Typography>
              )}
            </div>
          );
        })}
      </div>
      {isAnswered ? (
        <div
          className={classNames("mt-3 rounded-lg p-4", {
            "bg-green-50 text-green-700": isCorrect,
            "bg-red-50 text-red-700": !isCorrect,
          })}
        >
          <Trans
            components={{ span: <span /> }}
            i18nKey="labels.quizResultPage.questionResult"
            values={{
              answer: isCorrect
                ? t("labels.quizResultPage.correct")
                : t("labels.quizResultPage.incorrect"),
            }}
          />
        </div>
      ) : (
        <div className="mt-3 rounded-lg bg-gray-50 p-4 text-gray-700">
          {t("labels.quizResultPage.noAnswer")}
        </div>
      )}
    </div>
  );
};

export default ShowQuestionResult;
