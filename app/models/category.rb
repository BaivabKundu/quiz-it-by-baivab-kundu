# frozen_string_literal: true

class Category < ApplicationRecord
  MAX_NAME_LENGTH = 100

  has_many :assigned_quizzes, foreign_key: :assigned_category_id, class_name: "Quiz"

  validates :name, presence: true, uniqueness: true, length: { maximum: MAX_NAME_LENGTH }
end
