# frozen_string_literal: true

class Api::V1::QuestionsController < ApplicationController
  before_action :load_quiz!, only: [:index, :create, :show, :update, :destroy]
  before_action :load_question, only: [:update, :destroy]
  after_action :verify_authorized

  def index
    authorize @current_quiz, :public_and_admin?
    @questions = @current_quiz.questions.where(quiz_id: @current_quiz.id).order(created_at: :desc)
  end

  def show
    authorize @current_quiz, :admin_and_creator?
    @question = @current_quiz.questions.find(params[:id])
  end

  def create
    authorize @current_quiz, :admin_and_creator?
    @current_quiz.questions.create!(question_params)
    render_notice(t("successfully_created", entity: "Question"))
  end

  def update
    @question.update!(question_params)
    render_notice(t("successfully_updated", entity: "Question"))
  end

  def destroy
    @question.destroy!
    render_notice(t("successfully_deleted", entity: "Question"))
  end

  private

    def load_question
      authorize @current_quiz, :admin_and_creator?
      @question = @current_quiz.questions.find(params[:id])
    end

    def load_quiz!
      @current_quiz = @current_organization.quizzes.find_by!(slug: params[:quiz_slug])
    end

    def question_params
      params.require(:question).permit(:body, :answer_id, options: [:text, :is_correct])
    end
end
