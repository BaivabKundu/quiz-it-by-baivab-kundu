# frozen_string_literal: true

json.partial! 'api/v1/quizzes/quiz', quiz: @quiz
json.quiz do
  json.category do
    json.extract! @quiz.category, :id, :name if @quiz.category
  end
end
