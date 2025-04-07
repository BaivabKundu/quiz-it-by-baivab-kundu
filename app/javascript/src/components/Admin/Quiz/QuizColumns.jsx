import React from "react";

import { MenuHorizontal } from "@bigbinary/neeto-icons";
import { Tag, Dropdown, Tooltip } from "@bigbinary/neetoui";
import { format } from "date-fns";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export const getQuizColumns = (handlePublish, handleClone, handleDelete) => {
  const { Menu, MenuItem, Divider } = Dropdown;
  const { Button: MenuButton } = MenuItem;

  return [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
      render: (text, record) => (
        <Tooltip content={text} position="top">
          <Link
            className="block max-w-xs truncate"
            to={`/admin/quizzes/${record.slug}/questions`}
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
                className="text-black"
                style="link"
                onClick={() => handleClone(record.slug)}
              >
                Clone
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
};
