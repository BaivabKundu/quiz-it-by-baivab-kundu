# frozen_string_literal: true

json.questions @questions do |question|
  json.extract! question, :id, :body, :quiz_id, :created_at, :updated_at
  json.options question.options
end
json.quiz_status @current_quiz.status
json.quiz_updated_at @current_quiz.updated_at
