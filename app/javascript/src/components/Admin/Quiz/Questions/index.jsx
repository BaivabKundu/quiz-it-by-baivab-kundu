import React, { useState } from "react";

import { NoData, Typography } from "@bigbinary/neetoui";
import PageLoader from "components/Admin/commons/PageLoader";
import {
  useFetchQuestions,
  useDeleteQuestion,
  useCloneQuestion,
} from "hooks/reactQuery/useQuestionsApi";
import { isEmpty } from "ramda";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";

import QuestionDisplayCard from "./DisplayCard";

import Navbar from "../Navbar";

const QuizCreation = () => {
  const [activeTab, setActiveTab] = useState("questions");

  const { slug } = useParams();

  const {
    data: { questions: questionResponse = [] } = {},
    isLoading: isQuestionsLoading,
  } = useFetchQuestions(slug);

  const { mutate: deleteQuestion } = useDeleteQuestion();
  const { mutate: cloneQuestion } = useCloneQuestion();

  const handleDelete = (questionId, quizSlug) => {
    deleteQuestion({
      questionId,
      quizSlug,
    });
  };

  const handleClone = questionId => {
    cloneQuestion({
      questionId,
    });
  };

  if (isQuestionsLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="ml-16 flex min-h-screen w-full flex-col bg-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="mx-auto h-full w-full flex-1 px-4">
        <div className="my-4 flex justify-end">
          <Link
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            to={{
              pathname: `/admin/quizzes/${slug}/question/new`,
              state: { questionNumber: questionResponse.length + 1 },
            }}
          >
            <Typography>Add new question</Typography>
          </Link>
        </div>
        <div className="py-16">
          {activeTab === "questions" &&
            (isEmpty(questionResponse) ? (
              <div className="flex h-96 items-center justify-center">
                <NoData title="No questions to show" />
              </div>
            ) : (
              <div className="w-full">
                <div className="flex w-full flex-col items-center">
                  <div className="mb-4 w-full max-w-[800px]">
                    <Typography>{questionResponse.length} questions</Typography>
                  </div>
                  <div className="relative flex h-[calc(100vh-300px)] w-full flex-col items-center overflow-y-auto">
                    {questionResponse.map(question => (
                      <div
                        className="mb-4 w-full max-w-[800px]"
                        key={question.id}
                      >
                        <QuestionDisplayCard
                          handleClone={handleClone}
                          handleDelete={handleDelete}
                          question={question}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          {activeTab === "submissions" && (
            <div className="flex h-72 items-center justify-center">
              <Typography className="text-xl font-medium text-gray-700">
                There are no submissions to show
              </Typography>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizCreation;
