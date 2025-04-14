# frozen_string_literal: true

class Api::V1::SubmissionsController < ApplicationController
  include Paginatable

  def index
    @quiz = Quiz.find_by!(slug: params[:slug])
    submissions = @quiz.submissions.order(created_at: :desc)
    submissions = SearchSubmissionService.new(submissions, params[:search_key]).process
    submissions = FilterSubmissionService.new(submissions, params[:filters]).process

    paginate(submissions, params)
  end

  def create
    @submission = EvaluationService.new(params).process!
  end

  def update
    @submission = Submission.find(params[:id])
    @submission.update!(submission_params)
    @submission = EvaluationService.new(params, @submission).process!
    render_notice("Submission updated successfully!")
  end

  private

    def submission_params
      params.require(:submission).permit(:status, answers: [:question_id, :selected_option_index])
    end
end
