# frozen_string_literal: true

class Question < ApplicationRecord
  include DeepCloneable
  belongs_to :quiz, counter_cache: true, touch: true

  validates :body, presence: true
  validates :options, presence: true
  validates :answer_id, presence: true

  before_create :set_quiz_to_draft_if_published
  before_update :set_quiz_to_draft_if_published

  private

    def set_quiz_to_draft_if_published
      if quiz.published?
        quiz.update!(status: :draft)
      end
    end
end
