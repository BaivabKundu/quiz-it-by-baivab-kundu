# frozen_string_literal: true

class Api::V1::SubmissionsController < ApplicationController
  include Paginatable
  before_action :load_quiz!, only: [:index]
  before_action :load_submission, only: [:update]

  def index
    submissions = @current_quiz.submissions.where(quiz_id: @current_quiz.id).order(created_at: :desc)
    submissions = FilterSubmissionService.new(submissions, params[:filters], params[:search_key]).process

    paginate(submissions, params)
  end

  def create
    @submission = EvaluationService.new(submission_params, nil, @current_organization).process!
  end

  def update
    @submission.update!(submission_params.except(:slug, :user_id))
    @submission = EvaluationService.new(submission_params, @submission, @current_organization).process!
  end

  private

    def load_submission
      @current_quiz = @current_organization.quizzes.find_by!(slug: params[:submission][:slug])
      @submission = @current_quiz.submissions.find(params[:id])
    end

    def load_quiz!
      @current_quiz = @current_organization.quizzes.find_by!(slug: params[:slug])
    end

    def submission_params
      params.require(:submission).permit(:status, :slug, :user_id, answers: [:question_id, :selected_option_index])
    end
end
