# frozen_string_literal: true

class Api::V1::QuizzesController < ApplicationController
  include Paginatable
  before_action :load_quiz!, only: [:show, :update, :destroy]
  before_action :load_quizzes, only: %i[bulk_update bulk_destroy]
  after_action :verify_policy_scoped, only: :index

  def index
    quizzes = policy_scope(Quiz.all).order(created_at: :desc).includes(:category)

    @total_quizzes = quizzes.count
    @published_quizzes = quizzes.published.count
    @draft_quizzes = quizzes.draft.count

    quizzes = FilterQuizService.new(
      quizzes, params).process

    paginate(quizzes, index_params)
  end

  def show
    authorize @quiz
    render
  end

  def create
    quiz = @current_organization.quizzes.create!(quiz_params)
    authorize quiz
    render json: { notice: t("successfully_created", entity: "Quiz"), slug: quiz.slug }
  end

  def update
    authorize @quiz
    @quiz.update!(quiz_params)
    render_notice(t("successfully_updated", entity: "Quiz"))
  end

  def destroy
    authorize @quiz
    @quiz.destroy
    render_notice(t("successfully_deleted", entity: "Quiz"))
  end

  def bulk_update
    update_fields = bulk_update_params[:update_fields].to_h.merge(updated_at: Time.current)
    @quizzes.each do |quiz|
      quiz.update!(update_fields)
    end
    render_notice(t("successfully_updated", entity: "Quizzes"))
  end

  def bulk_destroy
    @quizzes.destroy_all
    render_notice(t("successfully_deleted", entity: "Quizzes"))
  end

  private

    def load_quiz!
      @quiz = @current_organization.quizzes.find_by!(slug: params[:slug])
    end

    def quiz_params
      params.require(:quiz).permit(
        :name,
        :status,
        :accessibility,
        :time_limit,
        :randomize_choices,
        :randomize_questions,
        :category_id,
        :organization_id,
        :submissions_count,
        :creator_id
      )
    end

    def bulk_update_params
      params.require(:quizzes)
        .permit(update_fields: [:status, :category_id], id: [])
    end

    def load_quizzes
      @quizzes = Quiz.where(id: params[:quizzes][:id])
      render_error(t("not_found", entity: "Quizzes")) if @quizzes.empty?
    end

    def index_params
      params.permit(:page, :status, :search_key, :filters)
    end
end
