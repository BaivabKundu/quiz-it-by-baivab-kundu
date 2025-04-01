import React, { useState, useEffect } from "react";

import { useCreateQuestion } from "hooks/reactQuery/useQuestionsApi";
import {
  useParams,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";

import Navbar from "./Navbar";
import QuestionForm from "./QuestionForm";

const QuestionBuilder = () => {
  const location = useLocation();
  const questionNumber = String(location.state?.questionNumber || 1).padStart(
    2,
    "0"
  );
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
    { id: 3, text: "", isCorrect: false },
    { id: 4, text: "", isCorrect: false },
  ]);
  const [activeTab, setActiveTab] = useState("questions");

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const hasQuestion = question.trim().length > 0;
    const hasEnoughOptions =
      options.filter(opt => opt.text.trim().length > 0).length >= 2;
    const hasCorrectAnswer = options.some(opt => opt.isCorrect);

    setIsValid(hasQuestion && hasEnoughOptions && hasCorrectAnswer);
  }, [question, options]);

  const { slug } = useParams();

  const { mutate: createQuestion } = useCreateQuestion(slug);

  const handleSubmit = values => {
    const { question, options } = values;
    createQuestion({
      body: question,
      options: options.map(option => ({
        text: option.text,
        isCorrect: option.isCorrect,
      })),
      answerId: options.find(option => option.isCorrect)?.id,
    });
  };

  const handleOptionChange = (id, text) => {
    setOptions(
      options.map(option => (option.id === id ? { ...option, text } : option))
    );
  };

  const handleCorrectAnswerChange = id => {
    setOptions(
      options.map(option => ({ ...option, isCorrect: option.id === id }))
    );
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      const newId = Math.max(...options.map(opt => opt.id)) + 1;
      setOptions([...options, { id: newId, text: "", isCorrect: false }]);
    }
  };

  const handleRemoveOption = id => {
    if (options.length > 2) {
      const newOptions = options.filter(opt => opt.id !== id);
      // If we're removing the correct answer, clear the correct answer flag
      if (
        options.find(opt => opt.id === id)?.isCorrect &&
        newOptions.length > 0
      ) {
        newOptions[0].isCorrect = true;
      }
      setOptions(newOptions);
    }
  };

  return (
    <div className="ml-16 w-full">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mx-auto mt-20 w-2/3 px-4 py-8">
        <div className="mb-8 flex items-center text-sm text-gray-500">
          <span>All Questions</span>
          <span className="mx-2">›</span>
          <span className="font-semibold">Question {questionNumber}</span>
        </div>
        <QuestionForm
          handleSubmit={handleSubmit}
          isValid={isValid}
          options={options}
          question={question}
          initialValues={{
            question,
            options,
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

export default QuestionBuilder;
