# frozen_string_literal: true

class Organization < ApplicationRecord
  MAX_NAME_LENGTH = 100

  has_many :users, foreign_key: :organization_id, class_name: "User"
  has_many :quizzes, foreign_key: :organization_id, class_name: "Quiz"
  has_many :categories, foreign_key: :organization_id, class_name: "Category"
  has_many :redirections

  validates :name, presence: true, uniqueness: true, length: { maximum: MAX_NAME_LENGTH }
end
