import React, { useState } from "react";

import { Globe, ListDetails, Settings } from "@bigbinary/neeto-icons";
import { Avatar } from "@bigbinary/neetoui";
import classnames from "classnames";
import { getFromLocalStorage } from "utils/storage";

import QuizLogo from "./QuizLogo";
import SidePane from "./SidePane";

const Sidebar = ({ onSidebarOpen }) => {
  const [isPaneOpen, setIsPaneOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsPaneOpen(true);
    onSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsPaneOpen(false);
    onSidebarOpen(false);
  };

  const userName = getFromLocalStorage("authUserName");

  return (
    <div
      className="fixed flex h-screen"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={classnames(
          "flex flex-col items-center border-r border-gray-200 bg-white py-2 transition-all duration-300 ease-in-out",
          {
            "w-0 opacity-0": isPaneOpen,
            "w-16 opacity-100": !isPaneOpen,
          }
        )}
      >
        <div className="mb-2 rounded-lg p-2">
          <QuizLogo />
        </div>
        <div className="my-2 rounded-lg p-2 hover:bg-gray-400">
          <ListDetails className="h-6 w-6" />
        </div>
        <div className="my-2 rounded-lg p-2 hover:bg-gray-400">
          <Settings className="h-6 w-6" />
        </div>
        <div className="my-2 rounded-lg p-2 hover:bg-gray-400">
          <Globe className="h-6 w-6" />
        </div>
        <div className="mb-6 flex h-full flex-col justify-end">
          <Avatar
            className="mx-5 cursor-pointer"
            size="large"
            user={{
              name: userName,
            }}
          />
        </div>
      </div>
      <SidePane isOpen={isPaneOpen} />
    </div>
  );
};

export default Sidebar;
