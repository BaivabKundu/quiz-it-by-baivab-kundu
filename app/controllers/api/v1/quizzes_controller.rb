# frozen_string_literal: true

class Api::V1::QuizzesController < ApplicationController
  include Paginatable
  before_action :load_quiz!, only: [:show, :update, :destroy]
  before_action :load_quizzes, only: %i[bulk_update bulk_destroy]
  after_action :verify_policy_scoped, only: :index

  def index
    scoped_quizzes = policy_scope(Quiz.all)
    quizzes = scoped_quizzes.order(created_at: :desc).includes(:category)

    total_quizzes = quizzes.count
    published_quizzes = quizzes.published.count
    draft_quizzes = quizzes.draft.count

    quizzes = quizzes.where(status: params[:status].downcase) if params[:status].present? && params[:status] != "all"
    quizzes = SearchQuizService.new(quizzes, params[:search_key]).process
    quizzes = FilterQuizService.new(quizzes, params[:filters]).process

    paginate(
      quizzes, index_params.merge(
        {
          total_quizzes: total_quizzes,
          published_quizzes: published_quizzes,
          draft_quizzes: draft_quizzes
        }))
  end

  def show
    render
  end

  def create
    quiz = Quiz.new(quiz_params)
    quiz.save!
    render json: { notice: t("successfully_created", entity: "Quiz"), slug: quiz.slug }
  end

  def update
    if quiz_params[:status] == "published" && @quiz.questions.empty?
      return render_error(t("cannot_publish_empty_quiz"))
    end

    @quiz.update!(quiz_params)
    render_notice(t("successfully_updated", entity: "Quiz"))
  end

  def destroy
    @quiz.destroy
    render_notice(t("successfully_deleted", entity: "Quiz"))
  end

  def bulk_update
    if bulk_update_params[:update_fields][:status] == "published"
      empty_quizzes = @quizzes.select { |quiz| quiz.questions.empty? }
      if empty_quizzes.any?
        return render_error(t("cannot_publish_empty_quizzes", count: empty_quizzes.size))
      end
    end
    update_fields = bulk_update_params[:update_fields].to_h.merge(updated_at: Time.current)
    @quizzes.update_all(update_fields)
    render_notice(t("successfully_updated", entity: "Quizzes"))
  end

  def bulk_destroy
    @quizzes.destroy_all
    render_notice(t("successfully_deleted", entity: "Quizzes"))
  end

  private

    def load_quiz!
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
