# frozen_string_literal: true

class Api::V1::QuestionsController < ApplicationController
  before_action :load_quiz, only: [:index, :create, :show, :update, :destroy]
  before_action :load_question, only: [:update, :destroy]

  # GET /api/v1/quizzes/:quiz_slug/questions
  def index
    @questions = @current_quiz.questions.where(quiz_id: @current_quiz.id).order(created_at: :desc)
  end

  # GET /api/v1/quizzes/:quiz_slug/questions/:id
  def show
    @question = @current_quiz.questions.find(params[:id])
  end

  # POST /api/v1/quizzes/:quiz_slug/questions
  def create
    question = @current_quiz.questions.new(question_params)
    question.save!
    render_notice(t("successfully_created", entity: "Question"))
  end

  # PATCH/PUT /api/v1/quizzes/:quiz_slug/questions/:id
  def update
    @question.update!(question_params)
    render_notice(t("successfully_updated", entity: "Question"))
  end

  # DELETE /api/v1/quizzes/:quiz_slug/questions/:id
  def destroy
    @question.destroy!
    render_notice(t("successfully_deleted", entity: "Question"))
  end

  private

    def load_question
      @question = @current_quiz.questions.find(params[:id])
    end

    def load_quiz
      @current_quiz = Quiz.find_by!(slug: params[:quiz_slug])
    end

    def question_params
      params.require(:question).permit(:body, :answer_id, options: [:text, :is_correct])
    end
end
