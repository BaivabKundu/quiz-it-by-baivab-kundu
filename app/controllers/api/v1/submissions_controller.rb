# frozen_string_literal: true

class Api::V1::SubmissionsController < ApplicationController
  include Paginatable
  before_action :load_quiz!, only: [:index, :update]
  before_action :load_submission, only: [:update]

  def index
    submissions = @current_quiz.submissions.where(assigned_quiz_id: @current_quiz.id).order(created_at: :desc)
    submissions = SearchSubmissionService.new(submissions, params[:search_key]).process
    submissions = FilterSubmissionService.new(submissions, params[:filters]).process

    paginate(submissions, params)
  end

  def create
    @submission = EvaluationService.new(params).process!
  end

  def update
    @submission.update!(submission_params)
    @submission = EvaluationService.new(params, @submission).process!
    render_notice("Submission updated successfully!")
  end

  private

    def load_submission
      @submission = @current_quiz.submissions.find(params[:id])
    end

    def load_quiz!
      @current_quiz = Quiz.find_by!(slug: params[:slug])
    end

    def submission_params
      params.require(:submission).permit(:status, answers: [:question_id, :selected_option_index])
    end
end
