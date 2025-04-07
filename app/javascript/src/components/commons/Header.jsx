import React, { useState } from "react";

import useQueryParams from "hooks/useQueryParams";
import { t } from "i18next";
import Header from "neetomolecules/Header";
import { Button } from "neetoui";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

import NewQuizPane from "../Quiz/NewQuizPane";

const NeetoHeader = () => {
  const location = useLocation();
  const isSubmissionsPage = location.pathname.includes("/submissions");

  const queryParams = useQueryParams();
  const { searchTerm } = queryParams;

  const [searchValue, setSearchValue] = useState(searchTerm);
  const [isCreateNewQuizPaneOpen, setIsCreateNewQuizPaneOpen] = useState(false);

  return (
    <>
      <Header
        className="px-5"
        title={!isSubmissionsPage ? t("labels.header") : "All submissions"}
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
          },
          value: searchValue,
          placeholder: !isSubmissionsPage
            ? t("inputPlaceholders.searchInput")
            : "Search names",
        }}
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
