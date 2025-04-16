import React, { useEffect, useState } from "react";

import { Bar as FiltersBar } from "@bigbinary/neeto-filters-frontend";
import { Modal, ProgressBar, Toastr, Typography } from "@bigbinary/neetoui";
import createConsumer from "channels/consumer";
import { subscribeToReportDownloadChannel } from "channels/reportDownloadChannel";
import FileSaver from "file-saver";
import {
  useDownloadPdf,
  useGeneratePdf,
} from "hooks/reactQuery/useSubmissionsApi";
import SubHeader from "neetomolecules/SubHeader";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const SubHeaderComponent = ({
  submissionResponse,
  isFilterPaneOpen,
  setIsFilterPaneOpen,
  handleColumnVisibilityChange,
  columns,
  filterColumns,
}) => {
  const { t } = useTranslation();

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Downloading report");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { slug } = useParams();

  const consumer = createConsumer();

  const { mutate: generatePdf } = useGeneratePdf(slug);
  const { mutate: downloadPdf } = useDownloadPdf();

  const closeModal = () => setIsModalOpen(false);

  const handleGeneratePdf = () => generatePdf();

  const handleDownloadPdf = () => {
    downloadPdf(null, {
      onSuccess: data => {
        FileSaver.saveAs(data, "quiz_submission_report.pdf");
        closeModal();
      },
      onError: () => {
        Toastr.error("Failed to download the report");
        closeModal();
      },
    });
  };

  useEffect(() => {
    if (progress === 100) {
      handleDownloadPdf();
    }
  }, [progress]);

  const handleDownloadClick = () => {
    setIsModalOpen(true);
    subscribeToReportDownloadChannel({
      consumer,
      setMessage,
      setProgress,
      generatePdf: handleGeneratePdf,
    });
  };

  return (
    <div>
      <SubHeader
        leftActionBlock={
          <Typography component="h4" style="h4">
            {t("labels.numberOfSubmissions", {
              count: submissionResponse.length,
              title:
                submissionResponse.length === 1
                  ? t("labels.submission")
                  : t("labels.submission(s)"),
            })}
          </Typography>
        }
        rightActionBlock={
          <SubHeader.RightBlock
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
            downloadButtonProps={{
              onClick: handleDownloadClick,
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
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="space-y-2 p-6">
          <p className="text-xl font-semibold">{message}</p>
          <ProgressBar
            progressPercentage={progress}
            progressValue={`${progress}%`}
          />
        </div>
      </Modal>
      <FiltersBar
        className="mb-4"
        columns={filterColumns}
        setIsPaneOpen={setIsFilterPaneOpen}
      />
    </div>
  );
};

export default SubHeaderComponent;
