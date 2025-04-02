import React, { useState, useEffect } from "react";

import { Typography } from "@bigbinary/neetoui";
import PageLoader from "components/commons/PageLoader";
import {
  useFetchQuestions,
  useDeleteQuestion,
  useCloneQuestion,
} from "hooks/reactQuery/useQuestionsApi";
import { useUpdateQuiz } from "hooks/reactQuery/useQuizzesApi";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";

import Navbar from "./Navbar";
import QuestionDisplayCard from "./QuestionDisplayCard";

const QuizCreation = () => {
  const [activeTab, setActiveTab] = useState("questions");
  const [currentQuizStatus, setCurrentQuizStatus] = useState(null);
  const [currentQuizUpdatedAt, setCurrentQuizUpdatedAt] = useState(null);
  const { slug } = useParams();

  const {
    data: { questions: questionResponse = [], quizStatus, quizUpdatedAt } = {},
    isLoading: isQuestionsLoading,
  } = useFetchQuestions(slug);

  useEffect(() => {
    if (quizStatus) {
      setCurrentQuizStatus(quizStatus);
    }

    if (quizUpdatedAt) {
      setCurrentQuizUpdatedAt(quizUpdatedAt);
    }
  }, [quizStatus, quizUpdatedAt]);

  const { mutate: deleteQuestion } = useDeleteQuestion();
  const { mutate: cloneQuestion } = useCloneQuestion();

  const { mutate: updateQuiz } = useUpdateQuiz(slug);

  const handleDelete = questionId => {
    deleteQuestion({
      questionId,
    });
  };

  const handleClone = questionId => {
    cloneQuestion({
      questionId,
    });
  };

  const handleQuizPublish = slug => {
    updateQuiz(
      {
        slug,
        payload: {
          status: currentQuizStatus === "published" ? "draft" : "published",
        },
      },
      {
        onSuccess: () => {
          setCurrentQuizStatus(prevQuizStatus =>
            prevQuizStatus === "published" ? "draft" : "published"
          );
          setCurrentQuizUpdatedAt(quizUpdatedAt);
        },
      }
    );
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
      <Navbar
        activeTab={activeTab}
        handleQuizPublish={handleQuizPublish}
        quizStatus={currentQuizStatus}
        quizUpdatedAt={currentQuizUpdatedAt}
        setActiveTab={setActiveTab}
      />
      <main className="mx-auto h-full w-full flex-1 px-4">
        <div className="my-4 flex justify-end">
          <Link
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            to={{
              pathname: `/quizzes/${slug}/questions/build`,
              state: { questionNumber: questionResponse.length + 1 },
            }}
          >
            <Typography>Add new question</Typography>
          </Link>
        </div>
        <div className="py-16">
          {activeTab === "questions" &&
            (isQuestionsLoading ? (
              <div className="flex h-72 items-center justify-center">
                <Typography className="text-xl font-medium text-gray-700">
                  There are no questions to show
                </Typography>
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
