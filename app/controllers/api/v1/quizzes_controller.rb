# frozen_string_literal: true

class Api::V1:: QuizzesController < ApplicationController
  before_action :load_quiz, only: [:show, :update, :destroy]
  before_action :load_quizzes, only: %i[bulk_update bulk_destroy]
  after_action :verify_authorized, only: :show
  after_action :verify_policy_scoped, only: :index

  def index
    scoped_quizzes = policy_scope(Quiz.all)
    quizzes = scoped_quizzes.order(created_at: :desc).includes(:category)
    quizzes = quizzes.where(status: params[:status].downcase) if params[:status].present? && params[:status] != "all"

    quizzes = SearchQuizService.new(quizzes, params[:search_key]).process

    quizzes = FilterQuizService.new(quizzes, params[:filters]).process

    pagination_service = PaginationService.new(quizzes, index_params)
    result = pagination_service.paginate

    @quizzes = result[:records]
    @meta = result[:meta]
  end

  def show
    authorize @quiz, :admin_and_creator?
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

  def bulk_update
    @quizzes.update_all(bulk_update_params[:update_fields].to_h)
    render_notice(t("successfully_updated", entity: "Quizzes"))
  end

  def bulk_destroy
    @quizzes.destroy_all
    render_notice(t("successfully_deleted", entity: "Quizzes"))
  end

  private

    def load_quiz
      @quiz = Quiz.find_by!(slug: params[:slug])
    end

    def quiz_params
      params.require(:quiz).permit(
        :name,
        :status,
        :accessibility,
        :assigned_category_id,
        :assigned_organization_id,
        :submissions_count,
        :creator_id
      )
    end

    def bulk_update_params
      params.require(:quizzes)
        .permit(update_fields: [:status, :assigned_category_id], id: [])
    end

    def load_quizzes
      @quizzes = Quiz.where(id: params[:quizzes][:id])
      render_error(t("not_found", entity: "Quizzes")) if @quizzes.empty?
    end

    def index_params
      params.permit(:page, :status, :search_key, :filters)
    end
end
