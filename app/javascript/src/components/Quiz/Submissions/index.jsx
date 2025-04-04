import React, { useState } from "react";

import { Table as NeetoTable, Typography, Tag } from "@bigbinary/neetoui";
import PageLoader from "components/commons/PageLoader";
import { format } from "date-fns";
import { useFetchSubmissions } from "hooks/reactQuery/useSubmissionsApi";
import useQueryParams from "hooks/useQueryParams";
import SubHeader from "neetomolecules/SubHeader";
import { mergeLeft, isEmpty } from "ramda";
import { useTranslation } from "react-i18next";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { buildUrl } from "utils/url";

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

  const { t } = useTranslation();

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

  const submissionColumns = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      width: 250,
    },
    {
      dataIndex: "email",
      key: "email",
      title: "Email",
      width: 200,
    },
    {
      dataIndex: "createdAt",
      key: "createdAt",
      title: "Submissions date",
      width: 200,
      render: date => format(new Date(date), "dd MMMM yyyy"),
    },
    {
      dataIndex: "correctAnswersCount",
      key: "correctAnswersCount",
      title: "Correct answers",
      width: 200,
    },
    {
      dataIndex: "wrongAnswersCount",
      key: "wrongAnswersCount",
      title: "Wrong answers",
      width: 200,
    },
    {
      dataIndex: "unansweredCount",
      key: "unansweredCount",
      title: "Unanswered",
      width: 200,
    },
    {
      dataIndex: "totalQuestions",
      key: "totalQuestions",
      title: "Questions",
      width: 200,
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 150,
      render: status => {
        status = status === "completed" ? "Completed" : "Incomplete";

        return (
          <Tag
            label={status}
            style={status === "Completed" ? "primary" : "warning"}
          />
        );
      },
    },
  ];

  const columns = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
    },
    {
      dataIndex: "email",
      key: "email",
      title: "Email",
    },
    {
      dataIndex: "createdAt",
      key: "createdAt",
      title: "Submissions date",
    },
    {
      dataIndex: "correctAnswersCount",
      key: "correctAnswersCount",
      title: "Correct answers",
    },
    {
      dataIndex: "wrongAnswersCount",
      key: "wrongAnswersCount",
      title: "Wrong answers",
    },
    {
      dataIndex: "unansweredCount",
      key: "unansweredCount",
      title: "Unanswered",
    },
    {
      dataIndex: "totalQuestions",
      key: "totalQuestions",
      title: "Questions",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
    },
  ];

  const filteredColumns = submissionColumns.filter(
    column => visibleColumnKeys.includes(column.key) || column.key === "action"
  );

  const filterColumns = [
    {
      key: "name",
      label: "Name",
      type: "text",
      node: "name",
    },
    {
      key: "email",
      label: "Email",
      type: "text",
      node: "email",
    },
    {
      key: "status",
      label: "Status",
      type: "multiSelect",
      node: "status",
      values: [
        {
          label: "Completed",
          value: "Completed",
        },
        {
          label: "Incomplete",
          value: "Incomplete",
        },
      ],
    },
  ];

  return (
    <div className="ml-16 flex w-full flex-1 flex-col overflow-hidden">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <NeetoHeader pageName="submissions" />
      <div className="px-4 py-8">
        <SubHeader
          leftActionBlock={
            <Typography component="h4" style="h4">
              {submissionResponse.length} submissions
            </Typography>
          }
          rightActionBlock={
            <SubHeader.RightBlock
              downloadButtonProps={{}}
              columnsButtonProps={{
                localStorageKey: "my-submission-table-columns",
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
                onChange: checkedColumns =>
                  handleColumnVisibilityChange(checkedColumns),
                className: "pb-2 px-2",
              }}
              filterProps={{
                isOpen: isFilterPaneOpen,
                setIsOpen: setIsFilterPaneOpen,
                columns: filterColumns,
                buttonProps: {
                  tooltipProps: {
                    content: t("labels.tooltips.filters"),
                    position: "bottom",
                    touch: ["hold", 500],
                  },
                },
              }}
            />
          }
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
