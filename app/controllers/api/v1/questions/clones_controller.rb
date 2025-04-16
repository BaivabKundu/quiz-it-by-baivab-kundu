# frozen_string_literal: true

class Api::V1::Questions::ClonesController < ApplicationController
  def clone
    question = Question.find(params[:id])
    cloned_question = question.deep_clone
    cloned_question.save!
    render_notice(t("successfully_cloned", entity: "Question"))
  end
end
