import { t } from "i18next";

export const DEFAULT_PAGE_INDEX = 1;

export const columns = [
  {
    dataIndex: "name",
    key: "name",
    title: t("labels.table.name"),
    isHidable: false,
  },
  { dataIndex: "category", key: "category", title: "Category" },
  {
    dataIndex: "submissionsCount",
    key: "submissionsCount",
    title: t("labels.table.submissionsCount"),
  },
  {
    dataIndex: "createdAt",
    key: "createdAt",
    title: t("labels.table.createdOn"),
  },
  {
    dataIndex: "status",
    key: "status",
    title: t("labels.table.status"),
  },
];
