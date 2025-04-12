import React from "react";

import { Checkmark } from "@bigbinary/neeto-icons";
import { Button, Typography } from "@bigbinary/neetoui";
import classNames from "classnames";
import { useTranslation, Trans } from "react-i18next";

const ShowQuestion = ({
  question = "",
  options = [],
  selectedAnswer = null,
  onAnswerSelect = () => {},
  currentQuestionIndex = 0,
  totalQuestions = 0,
  onPrevious = () => {},
  onNext = () => {},
  onSubmit = () => {},
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleOptionClick = optionIndex => {
    onAnswerSelect(optionIndex);
  };

  const { t } = useTranslation();

  return (
    <div className="mx-auto my-auto w-full max-w-3xl rounded-lg bg-white p-6 shadow-[0_0_8px_0_rgba(0,0,0,0.1)]">
      <div className="mb-6">
        <Typography className="mb-1 text-sm text-gray-600">
          {t("labels.quizAttemptCard.questionNumber", {
            currentQuestionIndex: currentQuestionIndex + 1,
            totalQuestionCount: totalQuestions,
          })}
        </Typography>
        <Typography className="text-3xl font-bold text-gray-900">
          <Trans
            components={{ span: <span /> }}
            i18nKey="labels.quizAttemptCard.questionName"
            values={{ name: question }}
          />
        </Typography>
      </div>
      <div className="mb-8 space-y-3">
        {Array.isArray(options) &&
          options.map((option, index) => (
            <Button
              key={index}
              style="text"
              className={classNames(
                "flex w-full items-center rounded-lg border-2 p-4 text-left transition-colors duration-200",
                {
                  "border-blue-500 bg-blue-50 text-blue-700":
                    selectedAnswer?.selectedOptionIndex === index,
                  "border-gray-200 hover:border-gray-300 hover:bg-gray-50":
                    selectedAnswer?.selectedOptionIndex !== index,
                }
              )}
              onClick={() => handleOptionClick(index)}
            >
              <div className="flex justify-center text-lg">
                <Checkmark className="mr-5" />
                <Trans
                  components={{ span: <span /> }}
                  i18nKey="labels.quizAttemptCard.optionText"
                  values={{ option: option.text }}
                />
              </div>
            </Button>
          ))}
      </div>
      <div className="flex justify-between">
        <Button
          disabled={currentQuestionIndex === 0}
          className={classNames(
            "rounded-lg px-6 py-3 transition-colors duration-200",
            {
              "cursor-not-allowed bg-gray-100 text-gray-400":
                currentQuestionIndex === 0,
              "bg-gray-100 text-gray-700 hover:bg-gray-200":
                currentQuestionIndex !== 0,
            }
          )}
          onClick={onPrevious}
        >
          {t("labels.buttons.previous")}
        </Button>
        {isLastQuestion ? (
          <Button
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors duration-200 hover:bg-blue-700"
            onClick={onSubmit}
          >
            {t("labels.buttons.saveAndSubmit")}
          </Button>
        ) : (
          <Button
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors duration-200 hover:bg-blue-700"
            onClick={onNext}
          >
            {t("labels.buttons.next")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShowQuestion;
