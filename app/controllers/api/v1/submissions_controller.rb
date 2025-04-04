# frozen_string_literal: true

class Api::V1::SubmissionsController < ApplicationController
  def index
    @quiz = Quiz.find_by!(slug: params[:slug])
    submissions = @quiz.submissions
    submissions = SearchSubmissionService.new(submissions, params[:search_key]).process
    submissions = FilterSubmissionService.new(submissions, params[:filters]).process
    pagination_service = PaginationService.new(submissions, params)
    result = pagination_service.paginate

    @submissions = result[:records]
    @meta = result[:meta]
  end
end
