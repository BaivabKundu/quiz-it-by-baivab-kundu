# frozen_string_literal: true

module Api
  module V1
    class QuizzesController < ApplicationController
      before_action :set_quiz, only: [:show, :update, :destroy]

      # GET /api/v1/quizzes
      def index
        @quizzes = Quiz.order(created_at: :desc)
        render json: @quizzes
      end

      # GET /api/v1/quizzes/:id
      def show
        render json: @quiz
      end

      # POST /api/v1/quizzes
      def create
        @quiz = Quiz.new(quiz_params)
        if @quiz.save
          render json: @quiz, status: :created
        else
          render json: @quiz.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/quizzes/:id
      def update
        if @quiz.update(quiz_params)
          render json: @quiz
        else
          render json: @quiz.errors, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/quizzes/:id
      def destroy
        @quiz.destroy
        head :no_content
      end

      private

        def set_quiz
          @quiz = Quiz.find_by!(slug: params[:slug])
        rescue ActiveRecord::RecordNotFound
          render json: { error: "Quiz not found" }, status: :not_found
        end

        def quiz_params
          params.require(:quiz).permit(
            :name,
            :status,
            :accessibility,
            :assigned_category_id,
            :creator_id
          )
        end
    end
  end
end
