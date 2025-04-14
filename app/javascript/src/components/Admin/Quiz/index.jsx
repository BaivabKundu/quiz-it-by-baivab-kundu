import React, { useState } from "react";

import {
  Table as NeetoTable,
  Typography,
  Alert,
  NoData,
  Button,
} from "@bigbinary/neetoui";
import PageLoader from "components/Admin/commons/PageLoader";
import {
  useFetchQuizzes,
  useUpdateQuiz,
  useDeleteQuiz,
  useCloneQuiz,
  useBulkUpdateQuizzes,
  useBulkDeleteQuizzes,
} from "hooks/reactQuery/useQuizzesApi";
import useQueryParams from "hooks/useQueryParams";
import { mergeLeft, isEmpty } from "ramda";
import { useTranslation, Trans } from "react-i18next";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useQuizzesStore } from "stores/useQuizzesStore";
import { buildUrl } from "utils/url";

import { DEFAULT_PAGE_INDEX, columns } from "./constants";
import FilterPane from "./FilterPane";
import { getQuizColumns } from "./QuizColumns";
import QuizSubHeader from "./SubHeader";
import {
  handlePublish,
  handleClone,
  handleDelete,
  confirmDelete,
  handleColumnVisibilityChange,
  handleBulkUpdate,
  handleBulkDelete,
} from "./utils";

import routes from "../../../routes";

const QuizList = ({ selectedRowKeys, onSelectRowKeys }) => {
  const [isFilterPaneOpen, setIsFilterPaneOpen] = useState(false);
  const [visibleColumnKeys, setVisibleColumnKeys] = useState([
    "category",
    "submissionsCount",
    "createdAt",
    "status",
  ]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [showBulkDeleteAlert, setShowBulkDeleteAlert] = useState(false);

  const { t } = useTranslation();

  const history = useHistory();

  const queryParams = useQueryParams();
  const {
    searchTerm,
    page,
    status = "all",
    filterName,
    filterCategories,
    filterStatus,
  } = queryParams;

  const [filters, setFilters] = useState(() => {
    const initialFilters = {};
    if (filterName) initialFilters.name = filterName;

    if (filterCategories) {
      initialFilters.selectedCategories = filterCategories.split(",");
    }

    if (filterStatus) initialFilters.status = filterStatus;

    return initialFilters;
  });

  const quizzesParams = {
    searchKey: searchTerm,
    page: Number(page || DEFAULT_PAGE_INDEX),
    status,
    filters: !isEmpty(filters) ? filters : {},
  };

  const setQuizCounts = useQuizzesStore(state => state.setQuizCounts);

  const handleSelect = selectedRowKeys => {
    onSelectRowKeys(selectedRowKeys);
  };

  const {
    data: { quizzes: quizResponse = [], meta = {} } = {},
    isLoading: isQuizzesLoading,
    refetch: reloadQuizzes,
  } = useFetchQuizzes(quizzesParams);

  if (quizResponse) {
    const allCount = meta.totalCount;
    const publishedCount = meta.publishedCount;
    const draftCount = meta.draftCount;

    setQuizCounts({ allCount, draftCount, publishedCount });
  }

  const { mutate: updateQuiz } = useUpdateQuiz();
  const { mutate: cloneQuiz } = useCloneQuiz();
  const { mutate: deleteQuiz } = useDeleteQuiz();
  const { mutate: bulkUpdateQuizzes } = useBulkUpdateQuizzes();
  const { mutate: bulkDeleteQuizzes } = useBulkDeleteQuizzes();

  const handleApplyFilters = newFilters => {
    setFilters(newFilters);
    onSelectRowKeys([]);
  };

  if (isQuizzesLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  const handlePageNavigation = newPage => {
    history.push(
      buildUrl(
        routes.admin.dashboard,
        mergeLeft({ page: newPage }, queryParams)
      )
    );
  };

  const handlePublishWrapper = (slug, status) =>
    handlePublish(slug, status, updateQuiz, reloadQuizzes);

  const handleCloneWrapper = slug => handleClone(slug, cloneQuiz);

  const handleDeleteWrapper = slug =>
    handleDelete(slug, setQuizToDelete, setShowDeleteAlert);

  const confirmDeleteWrapper = () =>
    confirmDelete(
      quizToDelete,
      deleteQuiz,
      setShowDeleteAlert,
      setQuizToDelete
    );

  const handleColumnVisibilityChangeWrapper = checkedColumns =>
    handleColumnVisibilityChange(checkedColumns, setVisibleColumnKeys);

  const quizColumns = getQuizColumns(
    handlePublishWrapper,
    handleCloneWrapper,
    handleDeleteWrapper
  );

  const filteredColumns = quizColumns.filter(
    column => visibleColumnKeys.includes(column.key) || column.key === "action"
  );

  const handleBulkUpdateWrapper = updateFields => {
    handleBulkUpdate(
      bulkUpdateQuizzes,
      selectedRowKeys,
      updateFields,
      reloadQuizzes,
      () => onSelectRowKeys([])
    );
  };

  const handleBulkDeleteWrapper = () => {
    handleBulkDelete(
      bulkDeleteQuizzes,
      selectedRowKeys,
      reloadQuizzes,
      () => onSelectRowKeys([]),
      setShowBulkDeleteAlert
    );
  };

  return (
    <div className="px-4 py-8">
      <QuizSubHeader
        columns={columns}
        filters={filters}
        handleColumnVisibilityChange={handleColumnVisibilityChangeWrapper}
        isFilterPaneOpen={isFilterPaneOpen}
        meta={meta}
        selectedRowKeys={selectedRowKeys}
        setIsFilterPaneOpen={setIsFilterPaneOpen}
        onApplyFilters={handleApplyFilters}
        onBulkDelete={() => setShowBulkDeleteAlert(true)}
        onBulkUpdate={handleBulkUpdateWrapper}
      />
      {queryParams.status && queryParams.status !== "all" && (
        <div className="my-2 flex items-center space-x-2">
          <Typography>
            {t("labels.quizzesStatus", {
              status:
                queryParams.status === "published"
                  ? t("labels.table.publishedStatus")
                  : t("labels.table.draftStatus"),
            })}
          </Typography>
          <Button
            label={t("labels.buttons.clear")}
            style="secondary"
            onClick={() => {
              const newQueryParams = { ...queryParams, status: "all" };
              history.replace(buildUrl(routes.admin.dashboard, newQueryParams));
            }}
          />
        </div>
      )}
      {isEmpty(quizResponse) ? (
        <div className="custom-table flex h-96 items-center justify-center">
          <NoData title={t("messages.noQuizzesAvailable")} />
        </div>
      ) : (
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
                  quizName: quizResponse.find(
                    quiz => quiz.slug === quizToDelete
                  )?.name,
                }}
              />
            </Typography>
          }
          onClose={() => setShowDeleteAlert(false)}
          onSubmit={confirmDeleteWrapper}
        />
      )}
      {showBulkDeleteAlert && (
        <Alert
          cancelButtonLabel={t("messages.alerts.bulkDeleteQuiz.cancelButton")}
          isOpen={showBulkDeleteAlert}
          submitButtonLabel={t("messages.alerts.bulkDeleteQuiz.confirmButton")}
          title={t("messages.alerts.bulkDeleteQuiz.title")}
          message={
            <Typography>
              {selectedRowKeys.length === 1 ? (
                <Trans
                  i18nKey="messages.alerts.bulkDeleteQuiz.quizMessage"
                  components={{
                    strong: <strong />,
                  }}
                  values={{
                    count: selectedRowKeys.length,
                  }}
                />
              ) : (
                <Trans
                  i18nKey="messages.alerts.bulkDeleteQuiz.message"
                  components={{
                    strong: <strong />,
                  }}
                  values={{
                    count: selectedRowKeys.length,
                  }}
                />
              )}
            </Typography>
          }
          onClose={() => setShowBulkDeleteAlert(false)}
          onSubmit={handleBulkDeleteWrapper}
        />
      )}
    </div>
  );
};

export default QuizList;
