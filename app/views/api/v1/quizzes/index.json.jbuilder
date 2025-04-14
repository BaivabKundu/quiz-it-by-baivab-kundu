# frozen_string_literal: true

json.quizzes @quizzes do |quiz|
  json.partial! 'api/v1/quizzes/quiz', quiz: quiz
  json.category quiz.category.name
end

json.meta @meta
