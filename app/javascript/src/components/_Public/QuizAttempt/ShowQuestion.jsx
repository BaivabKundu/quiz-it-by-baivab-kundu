import React from "react";

import { Checkmark } from "@bigbinary/neeto-icons";
import { Button, Typography } from "@bigbinary/neetoui";

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

  return (
    <div className="mx-auto my-auto w-full max-w-3xl rounded-lg bg-white p-6 shadow-[0_0_8px_0_rgba(0,0,0,0.1)]">
      <div className="mb-6">
        <Typography className="mb-1 text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </Typography>
        <Typography className="text-3xl font-bold text-gray-900">
          {question}
        </Typography>
      </div>
      <div className="mb-8 space-y-3">
        {Array.isArray(options) &&
          options.map((option, index) => (
            <Button
              key={index}
              style="text"
              className={`flex w-full items-center rounded-lg border-2 p-4 text-left transition-colors duration-200
              ${
                selectedAnswer?.selectedOptionIndex === index
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => handleOptionClick(index)}
            >
              <div className="flex justify-center text-lg">
                <Checkmark className="mr-5" />
                {option.text}
              </div>
            </Button>
          ))}
      </div>
      <div className="flex justify-between">
        <Button
          disabled={currentQuestionIndex === 0}
          className={`rounded-lg px-6 py-3 transition-colors duration-200
            ${
              currentQuestionIndex === 0
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          onClick={onPrevious}
        >
          Previous
        </Button>
        {isLastQuestion ? (
          <Button
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors duration-200 hover:bg-blue-700"
            onClick={onSubmit}
          >
            Save and Submit Quiz
          </Button>
        ) : (
          <Button
            className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors duration-200 hover:bg-blue-700"
            onClick={onNext}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShowQuestion;
