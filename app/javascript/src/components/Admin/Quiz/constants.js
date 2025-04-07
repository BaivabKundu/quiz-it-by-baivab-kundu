export const DEFAULT_PAGE_INDEX = 1;

export const columns = [
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
