import React from "react";

import {
  Globe,
  ListDetails,
  Settings,
  Left,
  ExternalLink,
} from "@bigbinary/neeto-icons";
import { Avatar, Button, Tag, Typography } from "@bigbinary/neetoui";
import authApi from "apis/auth";
import { resetAuthTokens } from "apis/axios";
import classnames from "classnames";
import { useFetchQuizzes } from "hooks/reactQuery/useQuizzesApi";
import { NavLink } from "react-router-dom";
import { getFromLocalStorage, setToLocalStorage } from "utils/storage";

const SidePane = ({ isOpen }) => {
  const { data: { quizzes: quizResponse = [] } = {} } = useFetchQuizzes();

  const quizzes = quizResponse || [];

  const allCount = quizzes.length;
  const publishedCount = quizzes.filter(
    quiz => quiz.status === "published"
  ).length;
  const draftCount = quizzes.filter(quiz => quiz.status === "draft").length;

  const userName = getFromLocalStorage("authUserName");
  const email = getFromLocalStorage("authEmail");

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setToLocalStorage({
        authToken: null,
        email: null,
        userId: null,
        userName: null,
      });
      resetAuthTokens();
      window.location.href = "/login";
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <div
      className={classnames(
        "h-screen overflow-hidden bg-gray-100 shadow-lg transition-all duration-300 ease-in-out",
        {
          "w-0": !isOpen,
          "w-80": isOpen,
        }
      )}
    >
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          <div className="my-2">
            <div className="my-2 flex items-center space-x-4 rounded-lg bg-black p-2 text-white">
              <ListDetails className="h-6 w-6" />
              <Typography style="body2">Quizzes</Typography>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="ml-10 flex cursor-pointer justify-between rounded-lg p-2 hover:bg-gray-200">
                <Typography style="body2">All</Typography>
                <Tag className="mr-2">{allCount}</Tag>
              </div>
              <div className="ml-10 flex cursor-pointer justify-between rounded-lg p-2 hover:bg-gray-200">
                <Typography style="body2">Published</Typography>
                <Tag className="mr-2">{publishedCount}</Tag>
              </div>
              <div className="ml-10 flex cursor-pointer justify-between rounded-lg p-2 hover:bg-gray-200">
                <Typography style="body2">Draft</Typography>
                <Tag className="mr-2">{draftCount}</Tag>
              </div>
            </div>
          </div>
          <NavLink
            activeClassName="bg-black text-white"
            className="my-2 flex items-center space-x-4 rounded-lg p-2 hover:bg-gray-200"
            to="/settings"
          >
            <Settings className="h-6 w-6" />
            <Typography style="body2">Settings</Typography>
          </NavLink>
          <NavLink
            // activeClassName="bg-black text-white"
            className="my-2 flex items-center space-x-4 rounded-lg p-2 hover:bg-gray-200"
            to="/"
          >
            <Globe className="h-6 w-6" />
            <Typography style="body2">Public page</Typography>
            <ExternalLink className="h-4 w-4" />
          </NavLink>
        </div>
        <div className=" p-3 shadow-sm">
          <div className="mb-4 flex items-center">
            <Avatar
              className="mr-3 h-12 w-12 rounded-full bg-blue-200"
              size="large"
            />
            <div>
              <Typography className="text-xl font-medium text-gray-800">
                {userName}
              </Typography>
              <Typography className="text-gray-600">{email}</Typography>
            </div>
          </div>
          <div className="mt-2 border-t pt-4">
            <Button
              className=" bg-white text-gray-700 hover:bg-gray-100"
              icon={Left}
              iconPosition="left"
              label="Logout"
              size="medium"
              style="secondary"
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePane;
