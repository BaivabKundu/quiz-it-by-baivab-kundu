# frozen_string_literal: true

class Api::V1:: QuizzesController < ApplicationController
  before_action :set_quiz, only: [:show, :update, :destroy]

  def index
    quizzes = Quiz.order(updated_at: :desc).includes(:category)
    quizzes = quizzes.where(status: params[:status].downcase) if params[:status].present? && params[:status] != "all"

    quizzes = ::SearchQuizService.new(quizzes, params[:search_key]).process

    quizzes = ::FilterQuizService.new(quizzes, params[:filters]).process

    pagination_service = ::PaginationService.new(quizzes, index_params)
    result = pagination_service.paginate

    @quizzes = result[:records]
    @meta = result[:meta]
  end

  def show
    render
  end

  def create
    quiz = Quiz.new(quiz_params)
    quiz.save!
    render_notice(t("successfully_created", entity: "Quiz"))
  end

  def update
    @quiz.update!(quiz_params)
    render_notice(t("successfully_updated", entity: "Quiz"))
  end

  def destroy
    @quiz.destroy
    render_notice(t("successfully_deleted", entity: "Quiz"))
  end

  private

    def set_quiz
      @quiz = Quiz.find_by!(slug: params[:slug])
    end

    def quiz_params
      params.require(:quiz).permit(
        :name,
        :status,
        :accessibility,
        :assigned_category_id,
        :submissions_count,
        :creator_id
      )
    end

    def index_params
      params.permit(:page, :status, :search_key, :filters)
    end
end
