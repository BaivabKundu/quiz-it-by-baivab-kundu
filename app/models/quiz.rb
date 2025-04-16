# frozen_string_literal: true

class Quiz < ApplicationRecord
  include DeepCloneable
  include Sluggable

  scope :published, -> { where(status: "published") }
  scope :draft, -> { where(status: "draft") }

  MAX_NAME_LENGTH = 125

  attribute :status, :string, default: "published"
  attribute :accessibility, :string, default: "discoverable"
  enum :status, { draft: "draft", published: "published" }, default: :draft
  enum :accessibility, { discoverable: "discoverable", hidden: "hidden" }, default: :discoverable

  belongs_to :category, foreign_key: "category_id", class_name: "Category"
  belongs_to :creator, foreign_key: "creator_id", class_name: "User"
  belongs_to :organization, foreign_key: "organization_id", class_name: "Organization"

  has_many :questions, dependent: :destroy
  has_many :submissions, foreign_key: :quiz_id, dependent: :destroy

  validates :name, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :questions_count, numericality: { greater_than_or_equal_to: 0 }
  validates :submissions_count, numericality: { greater_than_or_equal_to: 0 }
  validates :slug, uniqueness: true

  before_validation :ensure_questions_present, if: :publishing?

  private

    def publishing?
      status == "published" && status_changed?
    end

    def ensure_questions_present
      if questions.empty?
        errors.add(:base, I18n.t("cannot_publish_empty_quiz"))
      end
    end
end
