import { questionSchema } from "constants/validations";

import React from "react";

import { Checkmark, Delete } from "@bigbinary/neeto-icons";
import { Button } from "@bigbinary/neetoui";
import { Input, Form as NeetoUIForm } from "@bigbinary/neetoui/formik";

const QuestionForm = ({
  options,
  onQuestionChange,
  onOptionChange,
  onCorrectAnswerChange,
  onAddOption,
  onRemoveOption,
  initialValues,
  handleSubmit,
  handleSubmitAndAddNew,
}) => (
  <NeetoUIForm
    formikProps={{
      initialValues,
      validationSchema: questionSchema,
      onSubmit: handleSubmit,
      enableReinitialize: true,
    }}
  >
    {({
      values,
      setFieldValue,
      errors,
      touched,
      validateForm,
      setFieldTouched,
    }) => (
      <>
        <div className="mb-8">
          <Input
            nakedInput
            className="w-full border-b border-gray-200 p-3 focus:outline-none"
            error={touched.question && errors.question}
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
        <div className="mb-6 space-y-4" name="correctOptionId">
          {options.map((option, index) => (
            <div
              key={option.id}
              className={`flex items-center rounded-lg border p-2 ${
                option.isCorrect
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
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
                  setFieldValue("correctOptionId", Number(option.id));
                }}
              >
                <Checkmark className="h-6 w-6" />
              </Button>
              <Input
                nakedInput
                name={`options[${index}].text`}
                placeholder={`Type option ${index + 1}`}
                className={`flex-grow p-2 focus:outline-none ${
                  option.isCorrect ? "bg-blue-50" : ""
                }`}
                error={
                  touched.options?.[index]?.text &&
                  errors.options?.[index]?.text
                }
                style={{
                  fontSize: "1rem",
                  backgroundColor: option.isCorrect ? "#EFF6FF" : "#FFFFFF",
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
          {errors.correctOptionId && touched.correctOptionId && (
            <div className="mb-2 text-sm text-red-700">
              {errors.correctOptionId}
            </div>
          )}
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
            label="Save"
            style="text"
            type="submit"
          />
          <Button
            label="Save & add new question"
            style="text"
            type="button"
            onClick={async () => {
              setFieldTouched("question", true);
              setFieldTouched("correctOptionId", true);
              values.options.forEach((_, index) => {
                setFieldTouched(`options[${index}].text`, true);
              });

              const errors = await validateForm(values);
              if (Object.keys(errors).length === 0) {
                await handleSubmitAndAddNew(values);
              }
            }}
          />
        </div>
      </>
    )}
  </NeetoUIForm>
);

export default QuestionForm;
