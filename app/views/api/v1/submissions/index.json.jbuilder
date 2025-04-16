# frozen_string_literal: true

json.submissions @submissions do |submission|
  json.extract! submission, :id, :total_questions, :quiz_id, :correct_answers_count, :wrong_answers_count,
    :unanswered_count, :status, :created_at, :updated_at
  json.user_id submission.user.id
  json.name submission.user.username
  json.email submission.user.email
end

json.meta @meta
