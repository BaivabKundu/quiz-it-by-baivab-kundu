# frozen_string_literal: true

class Api::V1::Quizzes::ClonesController < ApplicationController
  before_action :load_quiz!, only: :clone

  def clone
    QuizCloneService.new(@quiz).process!
    render_notice(t("successfully_cloned", entity: "Quiz"))
  end

  private

    def load_quiz!
      @quiz = Quiz.find_by!(slug: params[:slug])
    end
end
