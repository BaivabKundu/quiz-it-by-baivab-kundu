export const handlePublish = (
  slug,
  status,
  updateQuiz,
  reloadQuizzes,
  setError
) => {
  updateQuiz(
    {
      slug,
      payload: { status: status === "published" ? "draft" : "published" },
    },
    {
      onSuccess: () => {
        reloadQuizzes();
      },
      onError: error => {
        setError(error.message);
      },
    }
  );
};

export const handleClone = (slug, cloneQuiz) => {
  cloneQuiz({
    slug,
  });
};

export const handleDelete = (slug, setQuizToDelete, setShowDeleteAlert) => {
  setQuizToDelete(slug);
  setShowDeleteAlert(true);
};

export const confirmDelete = (
  quizToDelete,
  deleteQuiz,
  setShowDeleteAlert,
  setQuizToDelete,
  setError
) => {
  deleteQuiz(quizToDelete, {
    onSuccess: () => {
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

export const handleColumnVisibilityChange = (
  checkedColumns,
  setVisibleColumnKeys
) => {
  setVisibleColumnKeys(checkedColumns.map(col => col.key));
};

export const handleBulkUpdate = (
  bulkUpdateQuizzes,
  selectedRowKeys,
  updateFields,
  reloadQuizzes,
  setSelectedRowKeys
) => {
  bulkUpdateQuizzes(
    { id: selectedRowKeys, update_fields: updateFields },
    {
      onSuccess: () => {
        reloadQuizzes();
        setSelectedRowKeys([]);
      },
    }
  );
};

export const handleBulkDelete = (
  bulkDeleteQuizzes,
  selectedRowKeys,
  reloadQuizzes,
  setSelectedRowKeys,
  setShowBulkDeleteAlert
) => {
  bulkDeleteQuizzes(
    { id: selectedRowKeys },
    {
      onSuccess: () => {
        reloadQuizzes();
        setSelectedRowKeys([]);
        setShowBulkDeleteAlert(false);
      },
    }
  );
};
