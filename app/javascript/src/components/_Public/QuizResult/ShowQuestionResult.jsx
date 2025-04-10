import React from "react";

import { CheckCircle, CloseCircle } from "@bigbinary/neeto-icons";
import { Typography } from "@bigbinary/neetoui";

const ShowQuestionResult = ({
  question,
  userAnswer,
  correctAnswer,
  questionIndex,
}) => {
  const isCorrect =
    userAnswer?.selectedOptionIndex === correctAnswer?.correctOptionId;
  const isAnswered = userAnswer !== undefined && userAnswer !== null;

  return (
    <div className="w-full">
      <Typography className="mb-1 text-lg text-gray-600">
        Question {questionIndex + 1}
      </Typography>
      <Typography className="mb-4 text-2xl font-bold">
        {question.body}
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
            rightLabel = "Your answer";
          } else if (userAnswer?.selectedOptionIndex === oIndex && !isCorrect) {
            optionStyle = "border-2 border-red-500 bg-white";
            iconComponent = (
              <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                <CloseCircle />
              </div>
            );
            rightLabel = "Your answer";
          } else if (correctAnswer?.correctOptionId === oIndex) {
            optionStyle = "border border-gray-200 bg-white";
            iconComponent = (
              <div className="mr-3 flex h-6 w-6 items-center justify-center">
                <CheckCircle />
              </div>
            );
            rightLabel = "Correct answer";
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
                  className={
                    userAnswer?.selectedOptionIndex === oIndex && !isCorrect
                      ? "text-red-500"
                      : "text-green-500"
                  }
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
          className={`mt-3 rounded-lg p-4 ${
            isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          Your answer is {isCorrect ? "correct" : "incorrect"}
        </div>
      ) : (
        <div className="mt-3 rounded-lg bg-gray-50 p-4 text-gray-700">
          You have not answered
        </div>
      )}
    </div>
  );
};

export default ShowQuestionResult;
