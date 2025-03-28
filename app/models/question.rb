# frozen_string_literal: true

class Question < ApplicationRecord
  belongs_to :quiz

  validates :body, presence: true
  validates :options, presence: true
  validates :answer_id, presence: true
end
