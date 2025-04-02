import { questionSchema } from "constants/validations";

import React from "react";

import { Checkmark, Delete } from "@bigbinary/neeto-icons";
import { Button } from "@bigbinary/neetoui";
import { Input, Form as NeetoUIForm } from "@bigbinary/neetoui/formik";

const QuestionForm = ({
  options,
  isValid,
  onQuestionChange,
  onOptionChange,
  onCorrectAnswerChange,
  onAddOption,
  onRemoveOption,
  initialValues,
  handleSubmit,
}) => (
  <NeetoUIForm
    formikProps={{
      initialValues,
      validationSchema: questionSchema,
      onSubmit: handleSubmit,
      enableReinitialize: true,
    }}
  >
    {({ values, setFieldValue }) => (
      <>
        <div className="mb-8">
          <Input
            nakedInput
            className="w-full border-b border-gray-200 p-3 focus:outline-none"
            name="question"
            placeholder="Type your question here..."
            style={{
              fontSize: "1.7rem",
              fontWeight: "500",
            }}
            onChange={({ target: { value } }) => {
              setFieldValue("question", value);
              onQuestionChange(value);
            }}
          />
        </div>
        <div className="mb-6 space-y-4">
          {options.map((option, index) => (
            <div
              className="flex items-center rounded-lg border border-gray-200 p-2"
              key={option.id}
            >
              <Button
                className="mr-3 flex-shrink-0 text-blue-500 focus:outline-none"
                style="text"
                onClick={() => {
                  onCorrectAnswerChange(option.id);
                  const newOptions = [...values.options];
                  newOptions.forEach((opt, i) => {
                    newOptions[i] = {
                      ...opt,
                      isCorrect: i === index,
                    };
                  });
                  setFieldValue("options", newOptions);
                }}
              >
                {option.isCorrect ? (
                  <Checkmark className="h-8 w-8 rounded-full bg-blue-100 py-1" />
                ) : (
                  <Checkmark className="h-6 w-6" />
                )}
              </Button>
              <Input
                nakedInput
                className="flex-grow p-2 focus:outline-none"
                name={`options[${index}].text`}
                placeholder={`Type option ${index + 1}`}
                style={{
                  fontSize: "1rem",
                }}
                onChange={({ target: { value } }) => {
                  setFieldValue(`options[${index}].text`, value);
                  onOptionChange(option.id, value);
                }}
              />
              <Button
                className="ml-2 flex-shrink-0"
                disabled={options.length <= 2}
                style="text"
                onClick={() => onRemoveOption(option.id)}
              >
                <Delete className="h-7 w-7 rounded-md bg-blue-100 p-1 text-blue-600" />
              </Button>
            </div>
          ))}
        </div>
        {options.length < 6 && (
          <Button
            className="mb-12 font-medium text-blue-500 hover:text-blue-600 focus:outline-none"
            label="Add new option"
            style="text"
            onClick={onAddOption}
          />
        )}
        <div className="flex space-x-4">
          <Button
            className="bg-blue-500 text-white"
            disabled={!isValid}
            label="Save"
            style="text"
            type="submit"
            onClick={e => {
              e.preventDefault();
              handleSubmit(values, "");
            }}
          />
          <Button
            disabled={!isValid}
            label="Save & add new question"
            style="text"
            type="button"
            onClick={() => {
              handleSubmit(values, "Save & add new question");
              setFieldValue("question", "");
              setFieldValue("options", [
                { id: 1, text: "", isCorrect: false },
                { id: 2, text: "", isCorrect: false },
                { id: 3, text: "", isCorrect: false },
                { id: 4, text: "", isCorrect: false },
              ]);
            }}
          />
        </div>
      </>
    )}
  </NeetoUIForm>
);

export default QuestionForm;
