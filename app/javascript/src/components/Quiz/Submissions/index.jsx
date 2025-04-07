import React, { useState } from "react";

import { Table as NeetoTable, Typography } from "@bigbinary/neetoui";
import PageLoader from "components/commons/PageLoader";
import { useFetchSubmissions } from "hooks/reactQuery/useSubmissionsApi";
import useQueryParams from "hooks/useQueryParams";
import { mergeLeft, isEmpty } from "ramda";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { buildUrl } from "utils/url";

import { submissionColumns, columns, filterColumns } from "./columns";
import SubHeaderComponent from "./SubHeader";

import routes from "../../../routes";
import NeetoHeader from "../../commons/Header";
import { DEFAULT_PAGE_INDEX } from "../constants";
import Navbar from "../Navbar";

const SubmissionList = () => {
  const [activeTab, setActiveTab] = useState("submissions");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
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

  const handleSelect = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const {
    data: { submissions: submissionResponse = [], meta = {} } = {},
    isLoading: isSubmissionsLoading,
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
      buildUrl(routes.dashboard, mergeLeft({ page: newPage }, queryParams))
    );
  };

  const handleColumnVisibilityChange = checkedColumns =>
    setVisibleColumnKeys(checkedColumns.map(col => col.key));

  const filteredColumns = submissionColumns.filter(
    column => visibleColumnKeys.includes(column.key) || column.key === "action"
  );

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
        {!isSubmissionsLoading ? (
          <div className="custom-table">
            <NeetoTable
              rowSelection
              columnData={filteredColumns}
              currentPageNumber={Number(meta.currentPage) || DEFAULT_PAGE_INDEX}
              defaultPageSize={meta.itemsPerPage}
              handlePageChange={handlePageNavigation}
              rowData={submissionResponse}
              selectedRowKeys={selectedRowKeys}
              totalCount={meta.totalCount}
              paginationProps={{
                className:
                  "custom-blue-table-pagination flex justify-start mt-4",
              }}
              onRowSelect={handleSelect}
            />
          </div>
        ) : (
          <Typography>No submissions available</Typography>
        )}
      </div>
    </div>
  );
};

export default SubmissionList;
