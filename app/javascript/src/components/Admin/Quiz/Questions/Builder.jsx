import React, { useState, useEffect, useCallback } from "react";

import { Typography } from "@bigbinary/neetoui";
import {
  useCreateQuestion,
  useShowQuestion,
  useUpdateQuestion,
} from "hooks/reactQuery/useQuestionsApi";
import {
  useParams,
  useLocation,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";

import QuestionForm from "./Form";
import {
  handleOptionChange,
  handleCorrectAnswerChange,
  handleAddOption,
  handleRemoveOption,
  handleSubmit,
  handleSubmitAndAddNew,
} from "./utils";

import Navbar from "../Navbar";

const QuestionBuilder = () => {
  const history = useHistory();
  const location = useLocation();
  const questionNumber = String(location.state?.questionNumber || 1).padStart(
    2,
    "0"
  );
  const isEditMode = location.pathname.includes("/edit");
  const { slug, id: questionId } = useParams();
  const { mutate: createQuestion } = useCreateQuestion(slug);

  const {
    data: { quiz: { question: questionData } = {} } = {},
    isLoading: isQuestionLoading,
  } = useShowQuestion(isEditMode ? questionId : null, isEditMode ? slug : null);

  const { mutate: updateQuestion } = useUpdateQuestion();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
    { id: 3, text: "", isCorrect: false },
    { id: 4, text: "", isCorrect: false },
  ]);

  useEffect(() => {
    if (isEditMode && !isQuestionLoading) {
      setQuestion(questionData.body);
      setOptions(
        questionData.options.map((option, index) => ({
          id: index + 1,
          text: option.text,
          isCorrect: option.isCorrect,
        }))
      );
    }
  }, [isQuestionLoading]);

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const hasQuestion = question.trim().length > 0;
    const hasEnoughOptions =
      options.filter(opt => opt.text?.trim().length > 0).length >= 2;
    const hasCorrectAnswer = options.some(opt => opt.isCorrect);

    setIsValid(hasQuestion && hasEnoughOptions && hasCorrectAnswer);
  }, [question, options]);

  const handleSubmitQuestion = useCallback(
    handleSubmit(
      isEditMode,
      updateQuestion,
      createQuestion,
      questionId,
      slug,
      history
    ),
    [isEditMode, updateQuestion, createQuestion, questionId, slug, history]
  );

  const handleSubmitAndAddNewQuestion = useCallback(
    handleSubmitAndAddNew(createQuestion, setQuestion, setOptions),
    [createQuestion, setQuestion, setOptions]
  );

  const [activeTab, setActiveTab] = useState("questions");

  const handleOptionChanges = useCallback(
    (id, text) => handleOptionChange(options, setOptions)(id, text),
    [options]
  );

  const handleCorrectAnswerChanges = useCallback(
    id => handleCorrectAnswerChange(options, setOptions)(id),
    [options]
  );

  const handleAddOptions = useCallback(
    () => handleAddOption(options, setOptions)(),
    [options]
  );

  const handleRemoveOptions = useCallback(
    id => handleRemoveOption(options, setOptions)(id),
    [options]
  );

  return (
    <div className="ml-16 w-full">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mx-auto mt-20 w-2/3 px-4 py-8">
        <div className="mb-8 flex items-center text-sm text-gray-500">
          <Typography>All Questions</Typography>
          <Typography className="mx-2">›</Typography>
          <Typography className="font-semibold">
            {isEditMode ? "Edit question" : `Question ${questionNumber}`}
          </Typography>
        </div>
        <QuestionForm
          handleSubmit={handleSubmitQuestion}
          handleSubmitAndAddNew={handleSubmitAndAddNewQuestion}
          isValid={isValid}
          options={options}
          question={question}
          initialValues={{
            question,
            options,
            correctOptionId: options.find(opt => opt.isCorrect)?.id || 0,
          }}
          onAddOption={handleAddOptions}
          onCorrectAnswerChange={handleCorrectAnswerChanges}
          onOptionChange={handleOptionChanges}
          onQuestionChange={setQuestion}
          onRemoveOption={handleRemoveOptions}
        />
      </div>
    </div>
  );
};

export default QuestionBuilder;
