# frozen_string_literal: true

class Api::V1::QuestionsController < ApplicationController
  before_action :set_question, only: [:show, :update, :destroy]
  before_action :set_quiz, only: [:index, :create, :update, :destroy]

  # GET /api/v1/quizzes/:quiz_slug/questions
  def index
    @questions = @quiz.questions
    render json: @questions
  end

  # GET /api/v1/quizzes/:quiz_slug/questions/:id
  def show
    ensure_question_belongs_to_quiz
    render json: @question
  end

  # POST /api/v1/quizzes/:quiz_slug/questions
  def create
    @question = @quiz.questions.new(question_params)
    if @question.save
      render json: @question, status: :created
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/quizzes/:quiz_slug/questions/:id
  def update
    ensure_question_belongs_to_quiz
    if @question.update(question_params)
      render json: @question
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/quizzes/:quiz_slug/questions/:id
  def destroy
    ensure_question_belongs_to_quiz
    @question.destroy
    head :no_content
  end

  private

    def set_question
      @question = Question.find(params[:id])
    end

    def set_quiz
      @quiz = Quiz.find_by!(slug: params[:quiz_slug])
    end

    def ensure_question_belongs_to_quiz
      unless @question.quiz_id == @quiz.id
        render json: { error: "Question does not belong to this quiz" }, status: :unprocessable_entity
      end
    end

    def question_params
      params.require(:question).permit(:body, :options, :answer_id)
    end
end
