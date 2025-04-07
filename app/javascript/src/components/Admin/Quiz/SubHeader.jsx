import React from "react";

import { Typography, Button } from "@bigbinary/neetoui";
import SubHeader from "neetomolecules/SubHeader";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { buildUrl } from "utils/url";

import BulkActions from "./BulkActions";

import routes from "../../../routes";

const QuizSubHeader = ({
  meta,
  setIsFilterPaneOpen,
  handleColumnVisibilityChange,
  columns,
  selectedRowKeys,
  onBulkUpdate,
  onBulkDelete,
  filters,
  onApplyFilters,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const hasSelected = selectedRowKeys.length > 0;
  const hasFilters = filters && Object.keys(filters).length > 0;

  return (
    <div className="flex flex-col">
      <SubHeader
        leftActionBlock={
          <>
            {!hasSelected ? (
              <div className="flex items-center space-x-2">
                <Typography component="h4" style="h4">
                  {t("messages.noOfQuizzes", { noOfQuizzes: meta.totalCount })}
                </Typography>
              </div>
            ) : (
              <Typography component="h4" style="h4">
                {selectedRowKeys.length} quizzes selected of {meta.totalCount}
              </Typography>
            )}
            {hasSelected && (
              <BulkActions
                selectedRowKeys={selectedRowKeys}
                onBulkDelete={onBulkDelete}
                onBulkUpdate={onBulkUpdate}
              />
            )}
          </>
        }
        rightActionBlock={
          <SubHeader.RightBlock
            columnsButtonProps={{
              localStorageKey: "my-quiz-table-columns",
              columnData: columns,
              actionBlock: null,
              isSearchable: false,
              buttonProps: {
                tooltipProps: {
                  content: t("labels.tooltips.columns"),
                  position: "bottom",
                  touch: ["hold", 500],
                },
              },
              onChange: handleColumnVisibilityChange,
              className: "pb-2 px-2",
            }}
            filterProps={{
              buttonProps: {
                tooltipProps: {
                  content: t("labels.tooltips.filters"),
                  position: "bottom",
                  touch: ["hold", 500],
                },
                onClick: () => setIsFilterPaneOpen(true),
              },
            }}
          />
        }
      />
      {hasFilters && (
        <div className="mb-4 flex items-center">
          <Typography component="span" style="body2">
            {(filters.selectedCategories?.length > 0
              ? `Categories: ${filters.selectedCategories.join(", ")}`
              : "") +
              (filters.selectedCategories?.length > 0 &&
              filters.status &&
              Object.keys(filters.status).length > 0
                ? " | "
                : "") +
              (filters.status && Object.keys(filters.status).length > 0
                ? `Status: ${
                    filters.status.charAt(0).toUpperCase() +
                    filters.status.slice(1)
                  }`
                : "")}
          </Typography>
          {(filters.selectedCategories?.length > 0 ||
            (filters.status && Object.keys(filters.status).length > 0)) && (
            <Button
              className="ml-2"
              label="Clear filters"
              style="secondary"
              onClick={() => {
                history.push(buildUrl(routes.admin.dashboard));
                onApplyFilters({});
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default QuizSubHeader;
