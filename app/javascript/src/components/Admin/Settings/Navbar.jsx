import React from "react";

import { Tab } from "@bigbinary/neetoui";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";
import { buildRoute } from "utils/url";

const Navbar = ({ activeTab, setActiveTab }) => {
  const history = useHistory();

  const { t } = useTranslation();

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex w-full items-center">
        <div className="flex flex-1 justify-center">
          <div className="flex items-center space-x-4 border-gray-200">
            <Tab size="small">
              <Tab.Item
                active={activeTab === "general"}
                onClick={() => {
                  setActiveTab("general");
                  history.push(buildRoute(routes.admin.settings.general));
                }}
              >
                {t("labels.general")}
              </Tab.Item>
              <Tab.Item
                active={activeTab === "redirections"}
                onClick={() => {
                  setActiveTab("redirections");
                  history.push(buildRoute(routes.admin.settings.redirections));
                }}
              >
                {t("labels.redirections")}
              </Tab.Item>
              <Tab.Item
                active={activeTab === "categories"}
                onClick={() => {
                  setActiveTab("categories");
                  history.push(buildRoute(routes.admin.settings.categories));
                }}
              >
                {t("labels.categories")}
              </Tab.Item>
            </Tab>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
