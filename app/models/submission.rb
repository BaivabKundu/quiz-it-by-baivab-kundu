# frozen_string_literal: true

class Submission < ApplicationRecord
  enum status: { completed: "completed", incomplete: "incomplete" }, _prefix: :status

  belongs_to :user, foreign_key: "attempter_id", class_name: "User"
  belongs_to :quiz, foreign_key: "quiz_id", class_name: "Quiz", counter_cache: true

  validates :total_questions, numericality: { greater_than_or_equal_to: 0, only_integer: true }
  validates :correct_answers_count, numericality: { greater_than_or_equal_to: 0, only_integer: true }
  validates :wrong_answers_count, numericality: { greater_than_or_equal_to: 0, only_integer: true }
  validates :unanswered_count, numericality: { greater_than_or_equal_to: 0, only_integer: true }
end
