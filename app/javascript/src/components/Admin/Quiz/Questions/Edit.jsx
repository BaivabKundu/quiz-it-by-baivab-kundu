import React, { useState } from "react";

import { Typography } from "@bigbinary/neetoui";
import PageLoader from "components/Admin/commons/PageLoader";
import {
  useShowQuestion,
  useUpdateQuestion,
} from "hooks/reactQuery/useQuestionsApi";
import useQuestionForm from "hooks/useQuestionForm";
import {
  useParams,
  useHistory,
} from "react-router-dom/cjs/react-router-dom.min";

import QuestionForm from "./Form";

import Navbar from "../Navbar";

const EditQuestion = () => {
  const [activeTab, setActiveTab] = useState("questions");

  const { slug, id: questionId } = useParams();
  const history = useHistory();

  const {
    data: { quiz: { question: questionData } = {} } = {},
    isLoading: isQuestionLoading,
  } = useShowQuestion(questionId, slug);
  const { mutate: updateQuestion } = useUpdateQuestion();

  const {
    question,
    setQuestion,
    options,
    isValid,
    handleOptionChange,
    handleCorrectAnswerChange,
    handleAddOption,
    handleRemoveOption,
  } = useQuestionForm(
    questionData?.body || "",
    questionData?.options.map((option, index) => ({
      id: index + 1,
      text: option.text,
      isCorrect: option.isCorrect,
    })) || []
  );

  const handleSubmit = (values, buttonLabel = "") => {
    updateQuestion({
      questionId,
      payload: {
        body: values.question,
        options: values.options.map(option => ({
          text: option.text,
          isCorrect: option.isCorrect,
        })),
      },
    });
    if (buttonLabel === "") history.push(`/admin/quizzes/${slug}/questions`);
  };

  if (isQuestionLoading) return <PageLoader />;

  return (
    <div className="ml-16 w-full">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mx-auto mt-20 w-2/3 px-4 py-8">
        <div className="mb-8 flex items-center text-sm text-gray-500">
          <Typography>All Questions</Typography>
          <Typography className="mx-2">›</Typography>
          <Typography className="font-semibold">Edit Question</Typography>
        </div>
        <QuestionForm
          handleSubmit={handleSubmit}
          isValid={isValid}
          options={questionData?.options || options}
          question={questionData?.body || question}
          initialValues={{
            question: questionData?.body || question,
            options: questionData?.options || options,
          }}
          onAddOption={handleAddOption}
          onCorrectAnswerChange={handleCorrectAnswerChange}
          onOptionChange={handleOptionChange}
          onQuestionChange={setQuestion}
          onRemoveOption={handleRemoveOption}
        />
      </div>
    </div>
  );
};

export default EditQuestion;
