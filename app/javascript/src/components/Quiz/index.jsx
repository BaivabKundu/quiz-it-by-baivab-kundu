import React, { useState } from "react";

import { MenuHorizontal } from "@bigbinary/neeto-icons";
import {
  Dropdown,
  Tooltip,
  Table as NeetoTable,
  Typography,
  Tag,
  Alert,
} from "@bigbinary/neetoui";
import PageLoader from "components/commons/PageLoader";
import { format } from "date-fns";
import {
  useFetchQuizzes,
  useUpdateQuiz,
  useDeleteQuiz,
} from "hooks/reactQuery/useQuizzesApi";
import useQueryParams from "hooks/useQueryParams";
import SubHeader from "neetomolecules/SubHeader";
import { mergeLeft, isEmpty } from "ramda";
import { useTranslation, Trans } from "react-i18next";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useQuizzesStore } from "stores/useQuizzesStore";
import { buildUrl } from "utils/url";

import { DEFAULT_PAGE_INDEX } from "./constants";
import FilterPane from "./FilterPane";

import routes from "../../routes";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isFilterPaneOpen, setIsFilterPaneOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [visibleColumnKeys, setVisibleColumnKeys] = useState([
    "category",
    "submissionsCount",
    "createdAt",
    "status",
  ]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  const { t } = useTranslation();

  const history = useHistory();

  const queryParams = useQueryParams();
  const { searchTerm, page, status = "all" } = queryParams;

  const quizzesParams = {
    searchKey: searchTerm,
    page: Number(page || DEFAULT_PAGE_INDEX),
    status,
    filters: !isEmpty(filters) ? filters : {},
  };

  const setQuizCounts = useQuizzesStore(state => state.setQuizCounts);

  const handleSelect = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const {
    data: { quizzes: quizResponse = [], meta = {} } = {},
    isLoading: isQuizzesLoading,
    refetch: reloadQuizzes,
  } = useFetchQuizzes(quizzesParams);

  if (quizResponse) {
    const allCount = quizResponse.length;
    const publishedCount = quizResponse.filter(
      quiz => quiz.status === "published"
    ).length;

    const draftCount = quizResponse.filter(
      quiz => quiz.status === "draft"
    ).length;

    setQuizCounts({ allCount, draftCount, publishedCount });
  }

  const { mutate: updateQuiz } = useUpdateQuiz();
  const { mutate: deleteQuiz } = useDeleteQuiz();

  const handleApplyFilters = newFilters => {
    setFilters(newFilters);
  };

  if (isQuizzesLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  const handlePageNavigation = newPage => {
    history.push(
      buildUrl(routes.dashboard, mergeLeft({ page: newPage }, queryParams))
    );
  };

  const handlePublish = (slug, status) => {
    updateQuiz(
      {
        slug,
        payload: { status: status === "published" ? "draft" : "published" },
      },
      {
        onSuccess: () => {
          reloadQuizzes();
          setQuizzes(prevQuizzes =>
            prevQuizzes.map(quiz =>
              quiz.slug === slug
                ? {
                    ...quiz,
                    status: status === "published" ? "Draft" : "Published",
                  }
                : quiz
            )
          );
        },
        onError: error => {
          setError(error.message);
        },
      }
    );
  };

  const handleDelete = slug => {
    setQuizToDelete(slug);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    deleteQuiz(quizToDelete, {
      onSuccess: () => {
        setQuizzes(prevQuizzes =>
          prevQuizzes.filter(quiz => quiz.slug !== quizToDelete)
        );
        setShowDeleteAlert(false);
        setQuizToDelete(null);
      },
      onError: error => {
        setError(error.message);
        setShowDeleteAlert(false);
        setQuizToDelete(null);
      },
    });
  };

  const handleColumnVisibilityChange = checkedColumns =>
    setVisibleColumnKeys(checkedColumns.map(col => col.key));

  const { Menu, MenuItem, Divider } = Dropdown;
  const { Button: MenuButton } = MenuItem;

  const quizColumns = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      render: (text, record) => (
        <Tooltip content={text} position="top">
          <Link
            className="block max-w-xs truncate"
            to={`/quizzes/${record.slug}/questions`}
          >
            {text.length > 30 ? `${text.slice(0, 30)}...` : text}
          </Link>
        </Tooltip>
      ),
      width: 250,
    },
    {
      dataIndex: "category",
      key: "category",
      title: "Category",
      width: 200,
    },
    {
      dataIndex: "submissionsCount",
      key: "submissionsCount",
      title: "Submissions count",
      width: 150,
    },
    {
      dataIndex: "createdAt",
      key: "createdAt",
      title: "Created on",
      width: 200,
      render: date => format(new Date(date), "dd MMMM yyyy"),
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 150,
      render: status => {
        status = status === "published" ? "Published" : "Draft";

        return (
          <Tag
            label={status}
            style={status === "Published" ? "info" : "warning"}
          />
        );
      },
    },
    {
      dataIndex: "action",
      key: "action",
      title: "Action",
      render: (_, record) => (
        <Dropdown
          buttonStyle="text"
          icon={MenuHorizontal}
          position="bottom-end"
          strategy="fixed"
        >
          <Menu>
            <MenuItem>
              <MenuButton
                className="text-black"
                style="link"
                onClick={() => handlePublish(record.slug, record.status)}
              >
                {record.status === "published" ? "Unpublish" : "Publish"}
              </MenuButton>
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuButton
                label="Delete"
                style="danger"
                type="delete"
                onClick={() => handleDelete(record.slug)}
              >
                Delete
              </MenuButton>
            </MenuItem>
          </Menu>
        </Dropdown>
      ),
      width: 100,
    },
  ];

  const columns = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      isHidable: false,
    },
    { dataIndex: "category", key: "category", title: "Category" },
    {
      dataIndex: "submissionsCount",
      key: "submissionsCount",
      title: "Submissions count",
    },
    {
      dataIndex: "createdAt",
      key: "createdAt",
      title: "Created on",
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
    },
  ];

  const filteredColumns = quizColumns.filter(
    column => visibleColumnKeys.includes(column.key) || column.key === "action"
  );

  return (
    <div className="w-auto px-4 py-8">
      <SubHeader
        leftActionBlock={
          <Typography component="h4" style="h4">
            {t("messages.noOfQuizzes", { noOfQuizzes: quizResponse.length })}
          </Typography>
        }
        rightActionBlock={
          <SubHeader.RightBlock
            columnsButtonProps={{
              localStorageKey: "my-table-columns",
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
      {!isQuizzesLoading ? (
        <div className="custom-table">
          <NeetoTable
            rowSelection
            columnData={filteredColumns}
            currentPageNumber={Number(meta.currentPage) || DEFAULT_PAGE_INDEX}
            defaultPageSize={meta.itemsPerPage}
            handlePageChange={handlePageNavigation}
            rowData={quizResponse}
            selectedRowKeys={selectedRowKeys}
            totalCount={meta.totalCount}
            paginationProps={{
              className: "custom-blue-table-pagination flex justify-start mt-4",
            }}
            onRowSelect={handleSelect}
          />
        </div>
      ) : (
        <Typography>{t("messages.noQuizzesAvailable")}</Typography>
      )}
      {isFilterPaneOpen && (
        <FilterPane
          currentFilters={filters}
          isOpen={isFilterPaneOpen}
          initialValues={{
            name: "",
            selectedCategories: [],
            status: "",
          }}
          onApplyFilters={handleApplyFilters}
          onClose={() => setIsFilterPaneOpen(false)}
        />
      )}
      {showDeleteAlert && (
        <Alert
          cancelButtonLabel={t("messages.alerts.deleteQuiz.cancelButton")}
          isOpen={showDeleteAlert}
          submitButtonLabel={t("messages.alerts.deleteQuiz.confirmButton")}
          title={t("messages.alerts.deleteQuiz.title")}
          message={
            <Typography>
              <Trans
                i18nKey="messages.alerts.deleteQuiz.message"
                components={{
                  strong: <strong />,
                }}
                values={{
                  quizName: quizzes.find(quiz => quiz.slug === quizToDelete)
                    ?.name,
                }}
              />
            </Typography>
          }
          onClose={() => setShowDeleteAlert(false)}
          onSubmit={confirmDelete}
        />
      )}
    </div>
  );
};

export default QuizList;
