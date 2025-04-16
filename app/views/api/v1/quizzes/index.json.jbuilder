# frozen_string_literal: true

json.quizzes @quizzes do |quiz|
  json.partial! "api/v1/quizzes/quiz", quiz: quiz
  json.category quiz.category.name
end

json.total_quizzes @total_quizzes
json.published_quizzes @published_quizzes
json.draft_quizzes @draft_quizzes
json.meta @meta
