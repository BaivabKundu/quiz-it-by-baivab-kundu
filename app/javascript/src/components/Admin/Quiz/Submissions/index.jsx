import React, { useState } from "react";

import { Table as NeetoTable, NoData } from "@bigbinary/neetoui";
import PageLoader from "components/Admin/commons/PageLoader";
import { useFetchSubmissions } from "hooks/reactQuery/useSubmissionsApi";
import useQueryParams from "hooks/useQueryParams";
import { t } from "i18next";
import { mergeLeft, isEmpty } from "ramda";
import { useTranslation } from "react-i18next";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import routes from "routes";
import { buildUrl, buildRoute } from "utils/url";
import withTitle from "utils/withTitle";

import { submissionColumns, columns, filterColumns } from "./columns";
import SubHeaderComponent from "./SubHeader";

import ErrorPageLayout from "../../commons/ErrorPageLayout";
import NeetoHeader from "../../commons/Header";
import { DEFAULT_PAGE_INDEX } from "../constants";
import Navbar from "../Navbar";

const SubmissionList = () => {
  const [activeTab, setActiveTab] = useState("submissions");
  const [isFilterPaneOpen, setIsFilterPaneOpen] = useState(false);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState([
    "useName",
    "useEmail",
    "createdAt",
    "correctAnswersCount",
    "wrongAnswersCount",
    "unansweredCount",
    "totalQuestions",
    "status",
  ]);

  const history = useHistory();

  const { t } = useTranslation();

  const { slug } = useParams();

  const queryParams = useQueryParams();
  const { searchTerm, page, name, email, status } = queryParams;

  const filters = {
    name: name?.slice(0, name.indexOf("+rule-contains")) || name,
    email: email?.slice(0, email.indexOf("+rule-contains")) || email,
    status,
  };

  const submissionsParams = {
    searchKey: searchTerm,
    page: Number(page || DEFAULT_PAGE_INDEX),
    filters: !isEmpty(filters) ? filters : {},
  };

  const {
    data: { submissions: submissionResponse = [], meta = {} } = {},
    isLoading: isSubmissionsLoading,
    error,
  } = useFetchSubmissions(slug, submissionsParams);

  if (isSubmissionsLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  const handlePageNavigation = newPage => {
    history.push(
      buildUrl(
        buildRoute(routes.admin.quizzes.submissions, slug),
        mergeLeft({ page: newPage }, queryParams)
      )
    );
  };

  const handleColumnVisibilityChange = checkedColumns =>
    setVisibleColumnKeys(checkedColumns.map(col => col.key));

  const filteredColumns = submissionColumns.filter(
    column => visibleColumnKeys.includes(column.key) || column.key === "action"
  );

  if (error) {
    return <ErrorPageLayout status={error.response.status} />;
  }

  return (
    <div className="ml-16 flex w-full flex-1 flex-col overflow-hidden">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <NeetoHeader />
      <div className="px-4 py-8">
        <SubHeaderComponent
          columns={columns}
          filterColumns={filterColumns}
          handleColumnVisibilityChange={handleColumnVisibilityChange}
          isFilterPaneOpen={isFilterPaneOpen}
          setIsFilterPaneOpen={setIsFilterPaneOpen}
          submissionResponse={submissionResponse}
        />
        {isEmpty(submissionResponse) ? (
          <div className="flex h-96 items-center justify-center">
            <NoData title={t("messages.noSubmissionsAvailable")} />
          </div>
        ) : (
          <div className="custom-table">
            <NeetoTable
              columnData={filteredColumns}
              currentPageNumber={Number(meta.currentPage) || DEFAULT_PAGE_INDEX}
              defaultPageSize={meta.itemsPerPage}
              handlePageChange={handlePageNavigation}
              rowData={submissionResponse}
              totalCount={meta.totalCount}
              paginationProps={{
                className:
                  "custom-blue-table-pagination flex justify-start mt-4",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default withTitle(SubmissionList, t("title.submissions"));
