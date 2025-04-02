# frozen_string_literal: true

class Api::V1::Questions::ClonesController < ApplicationController
  def clone
    question = Question.find(params[:id])
    question.deep_clone.save!
    render_notice(t("successfully_cloned", entity: "Question"))
  end
end
