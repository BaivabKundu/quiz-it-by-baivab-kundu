# frozen_string_literal: true

class SearchQuizService
  def initialize(quizzes, search_key)
    @quizzes = quizzes
    @search_key = search_key
  end

  def process
    return @quizzes if @search_key.blank?

    @quizzes.where("LOWER(name) LIKE ?", "%#{@search_key.downcase}%")
  end
end
