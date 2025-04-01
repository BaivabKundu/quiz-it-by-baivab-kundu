import React from "react";

import { LeftArrow } from "@bigbinary/neeto-icons";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";

const Navbar = ({ activeTab, setActiveTab }) => {
  const { slug } = useParams();
  const quizName = slug.replace(/-/g, " ");

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex w-full items-center">
        <div className="flex min-w-fit items-center font-medium text-gray-700">
          <Link to="/dashboard">
            <LeftArrow className="mx-4 h-7 w-7 rounded-full p-1 transition-all duration-200 hover:bg-gray-300 " />
          </Link>
          <span className="text-xl capitalize">{quizName}</span>
        </div>
        <div className="flex flex-1 justify-center">
          <div className="flex items-center space-x-4 border-gray-200">
            <Link
              to={`/quizzes/${slug}/questions`}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "questions" &&
                window.location.pathname.split("/").pop() === "questions"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 "
              }`}
              onClick={() => setActiveTab("questions")}
            >
              Questions
            </Link>
            <Link
              to={`/quizzes/${slug}/submissions`}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === "submissions"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 "
              }`}
              onClick={() => setActiveTab("submissions")}
            >
              Submissions
            </Link>
          </div>
        </div>
        <div className="w-72" />
      </div>
    </div>
  );
};

export default Navbar;
