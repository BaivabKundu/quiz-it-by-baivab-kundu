import React from "react";

import { MenuHorizontal } from "@bigbinary/neeto-icons";
import { Tag, Dropdown, Tooltip } from "@bigbinary/neetoui";
import { format } from "date-fns";
import { t } from "i18next";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

export const getQuizColumns = (handlePublish, handleClone, handleDelete) => {
  const { Menu, MenuItem, Divider } = Dropdown;
  const { Button: MenuButton } = MenuItem;

  return [
    {
      dataIndex: "name",
      key: "name",
      title: t("labels.table.name"),
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
      title: t("labels.table.category"),
      width: 200,
    },
    {
      dataIndex: "submissionsCount",
      key: "submissionsCount",
      title: t("labels.table.submissionsCount"),
      width: 150,
    },
    {
      dataIndex: "createdAt",
      key: "createdAt",
      title: t("labels.table.createdOn"),
      width: 200,
      render: date => format(new Date(date), "dd MMMM yyyy"),
    },
    {
      dataIndex: "status",
      key: "status",
      title: t("labels.table.status"),
      width: 150,
      render: status => {
        status =
          status === "published"
            ? t("labels.table.publishedStatus")
            : t("labels.table.draftStatus");

        return (
          <Tag
            label={status}
            style={
              status === t("labels.table.publishedStatus") ? "info" : "warning"
            }
          />
        );
      },
    },
    {
      dataIndex: "action",
      key: "action",
      title: t("labels.table.action"),
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
                {record.status === "published"
                  ? t("labels.buttons.unpublish")
                  : t("labels.buttons.publish")}
              </MenuButton>
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuButton
                className="text-black"
                style="link"
                onClick={() => handleClone(record.slug)}
              >
                {t("labels.buttons.clone")}
              </MenuButton>
            </MenuItem>
            <Divider />
            <MenuItem>
              <MenuButton
                style="danger"
                type="delete"
                onClick={() => handleDelete(record.slug)}
              >
                {t("labels.buttons.delete")}
              </MenuButton>
            </MenuItem>
          </Menu>
        </Dropdown>
      ),
      width: 100,
    },
  ];
};
