# frozen_string_literal: true

module Api
  module V1
    class QuizzesController < ApplicationController
      before_action :set_quiz, only: [:show, :update, :destroy]

      def index
        @quizzes = Quiz.order(created_at: :desc)
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
    end
  end
end
