# frozen_string_literal: true

class Category < ApplicationRecord
  MAX_NAME_LENGTH = 100

  belongs_to :organization
  has_many :quizzes, foreign_key: :category_id, class_name: "Quiz"

  validates :name, presence: true, uniqueness: { scope: :organization_id }, length: { maximum: MAX_NAME_LENGTH }
end
