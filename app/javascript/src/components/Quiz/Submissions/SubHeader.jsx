import React from "react";

import { Typography } from "@bigbinary/neetoui";
import SubHeader from "neetomolecules/SubHeader";
import { useTranslation } from "react-i18next";

const SubHeaderComponent = ({
  submissionResponse,
  isFilterPaneOpen,
  setIsFilterPaneOpen,
  handleColumnVisibilityChange,
  columns,
  filterColumns,
}) => {
  const { t } = useTranslation();

  return (
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
  );
};

export default SubHeaderComponent;
