# frozen_string_literal: true

class Api::V1::QuestionsController < ApplicationController
  before_action :set_question, only: [:show, :update, :destroy]
  before_action :set_quiz, only: [:index, :create, :update, :destroy]

  # GET /api/v1/quizzes/:quiz_slug/questions
  def index
    @questions = @current_quiz.questions.order(created_at: :desc)
  end

  # GET /api/v1/quizzes/:quiz_slug/questions/:id
  def show
    ensure_question_belongs_to_quiz
    # render json: @question
  end

  # POST /api/v1/quizzes/:quiz_slug/questions
  def create
    question = @current_quiz.questions.new(question_params)
    question.save!
    render_notice(t("successfully_created", entity: "Question"))
  end

  # PATCH/PUT /api/v1/quizzes/:quiz_slug/questions/:id
  def update
    ensure_question_belongs_to_quiz
    @question.update!(question_params)
    render_notice(t("successfully_deleted", entity: "Question"))
  end

  # DELETE /api/v1/quizzes/:quiz_slug/questions/:id
  def destroy
    ensure_question_belongs_to_quiz
    @question.destroy
    render_notice(t("successfully_deleted", entity: "Question"))
  end

  private

    def set_question
      @question = Question.find(params[:id])
    end

    def set_quiz
      @current_quiz = Quiz.find_by!(slug: params[:quiz_slug])
    end

    def ensure_question_belongs_to_quiz
      unless @question.quiz_id == @current_quiz.id
        render json: { error: "Question does not belong to this quiz" }, status: :unprocessable_entity
      end
    end

    def question_params
      params.require(:question).permit(:body, :answer_id, options: [:text, :is_correct])
    end
end
