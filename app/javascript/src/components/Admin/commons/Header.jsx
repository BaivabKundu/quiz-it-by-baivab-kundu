import React, { useState } from "react";

import useQueryParams from "hooks/useQueryParams";
import { t } from "i18next";
import Header from "neetomolecules/Header";
import { Button } from "neetoui";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

import NewQuizPane from "../Quiz/NewQuizPane";

const NeetoHeader = ({ onSearch }) => {
  const location = useLocation();
  const isSubmissionsPage = location.pathname.includes("/submissions");

  const queryParams = useQueryParams();
  const { searchTerm, status = "all" } = queryParams;

  const [searchValue, setSearchValue] = useState(searchTerm);
  const [isCreateNewQuizPaneOpen, setIsCreateNewQuizPaneOpen] = useState(false);

  return (
    <>
      <Header
        className="px-5"
        actionBlock={
          !isSubmissionsPage ? (
            <Button
              className="bg-blue-600"
              label={t("labels.buttons.addQuiz")}
              onClick={() => setIsCreateNewQuizPaneOpen(true)}
            />
          ) : null
        }
        searchProps={{
          onChange: event => {
            setSearchValue(event.target.value);
            onSearch();
          },
          value: searchValue,
          placeholder: !isSubmissionsPage
            ? t("inputPlaceholders.searchInput")
            : t("inputPlaceholders.searchNameInput"),
        }}
        title={(() => {
          if (isSubmissionsPage) return t("labels.submissionPage.heading");

          const statusTitleMap = {
            published: t("labels.publishedQuizzesHeading"),
            draft: t("labels.draftQuizzesHeading"),
            all: t("labels.heading"),
          };

          return statusTitleMap[status] || statusTitleMap.all;
        })()}
      />
      {isCreateNewQuizPaneOpen && (
        <NewQuizPane
          isOpen={isCreateNewQuizPaneOpen}
          initialValues={{
            name: "",
            assignedCategory: null,
          }}
          onClose={() => setIsCreateNewQuizPaneOpen(false)}
        />
      )}
    </>
  );
};

export default NeetoHeader;
