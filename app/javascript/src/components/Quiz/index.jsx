import React, { useEffect, useState } from "react";

import { Column, Filter, MenuHorizontal } from "@bigbinary/neeto-icons";
import {
  Dropdown,
  Tooltip,
  Table as NeetoTable,
  Typography,
  Tag,
} from "@bigbinary/neetoui";
import PageLoader from "components/commons/PageLoader";
import { format } from "date-fns";
import {
  useFetchQuizzes,
  useUpdateQuiz,
  useDeleteQuiz,
} from "hooks/reactQuery/useQuizzesApi";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const handleSelect = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const {
    data: { quizzes: quizResponse = [] } = {},
    isLoading: isQuizzesLoading,
    refetch,
  } = useFetchQuizzes();
  const { mutate: updateQuiz } = useUpdateQuiz();
  const { mutate: deleteQuiz } = useDeleteQuiz();

  const fetchQuizzes = async () => {
    try {
      if (!quizResponse) return;

      const quizzesWithCategory = quizResponse?.map(quiz => ({
        ...quiz,
        category: quiz.assignedCategory?.name,
      }));

      const quizzesValues = quizzesWithCategory.map(quiz => ({
        ...quiz,
        createdAt: format(new Date(quiz.createdAt), "dd MMMM yyyy"),
        status: quiz.status === "published" ? "Published" : "Draft",
      }));

      setQuizzes(quizzesValues);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (quizResponse) {
      fetchQuizzes();
    }
  }, [quizResponse]);

  if (isQuizzesLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  const handlePublish = (slug, status) => {
    updateQuiz(
      {
        slug,
        payload: { status: status === "Published" ? "draft" : "published" },
      },
      {
        onSuccess: () => {
          refetch();
          setQuizzes(prevQuizzes =>
            prevQuizzes.map(quiz =>
              quiz.slug === slug
                ? {
                    ...quiz,
                    status: status === "Published" ? "Draft" : "Published",
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
    deleteQuiz(slug, {
      onSuccess: () => {
        setQuizzes(prevQuizzes =>
          prevQuizzes.filter(quiz => quiz.slug !== slug)
        );
      },
      onError: error => {
        setError(error.message);
      },
    });
  };

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
            to={`/quizzes/${record.slug}/show`}
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
    },
    {
      dataIndex: "status",
      key: "status",
      title: "Status",
      width: 150,
      render: status => (
        <Tag
          label={status}
          style={status === "Published" ? "info" : "warning"}
        />
      ),
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
                {record.status === "Published" ? "Unpublish" : "Publish"}
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

  return (
    <div className="w-auto px-4 py-8">
      <div className="mb-5 flex w-full justify-between">
        <Typography className="text-xl font-bold">
          {quizzes.length} quizzes
        </Typography>
        <div className="flex space-x-3">
          <Column />
          <Filter />
        </div>
      </div>
      {quizzes ? (
        <NeetoTable
          rowSelection
          columns={quizColumns}
          currentPageNumber={1}
          dataSource={quizzes}
          defaultPageSize={10}
          selectedRowKeys={selectedRowKeys}
          onRowSelect={handleSelect}
          // handlePageChange={handlePageChange}
        />
      ) : (
        <p>No quizzes available</p>
      )}
    </div>
  );
};

export default QuizList;
