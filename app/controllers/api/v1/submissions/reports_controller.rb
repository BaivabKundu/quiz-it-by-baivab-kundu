# frozen_string_literal: true

class Api::V1::Submissions::ReportsController < ApplicationController
  def create
    ReportsJob.perform_async(current_user.id, report_params[:slug], report_params[:timezone], report_path.to_s)
  end

  def download
    if File.exist?(report_path)
      send_file(
        report_path,
        type: "application/pdf",
        filename: pdf_file_name,
        disposition: "attachment"
      )
    else
      render_error(t("not_found", entity: "report"), :not_found)
    end
  end

  private

    def report_path
      @_report_path ||= Rails.root.join("tmp/#{pdf_file_name}")
    end

    def pdf_file_name
      "submission_report.pdf"
    end

    def report_params
      params.require(:submission).permit(:slug, :timezone)
    end
end
