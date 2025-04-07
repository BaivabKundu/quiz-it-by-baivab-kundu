# frozen_string_literal: true

class Quiz < ApplicationRecord
  include DeepCloneable

  MAX_NAME_LENGTH = 125

  attribute :status, :string, default: "published"
  attribute :accessibility, :string, default: "discoverable"
  enum :status, { draft: "draft", published: "published" }, default: :draft
  enum :accessibility, { discoverable: "discoverable", hidden: "hidden" }, default: :discoverable

  belongs_to :category, foreign_key: "assigned_category_id", class_name: "Category"
  belongs_to :assigned_user, foreign_key: "creator_id", class_name: "User"

  has_many :questions, dependent: :destroy
  has_many :submissions, foreign_key: :assigned_quiz_id, dependent: :destroy

  validates :name, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :questions_count, numericality: { greater_than_or_equal_to: 0 }
  validates :submissions_count, numericality: { greater_than_or_equal_to: 0 }
  validates :slug, uniqueness: true
  validate :slug_not_changed

  before_create :set_slug

  private

    def set_slug
      name_slug = name.parameterize
      regex_pattern = "slug ~* ?"
      latest_quiz_slug = Quiz.where(
        regex_pattern,
        "^#{name_slug}$|^#{name_slug}-[0-9]+$"
      ).order("LENGTH(slug) DESC", slug: :desc).first&.slug
      slug_count = 0
      if latest_quiz_slug.present?
        slug_count = latest_quiz_slug.split("-").last.to_i
        only_one_slug_exists = slug_count == 0
        slug_count = 1 if only_one_slug_exists
      end
      slug_candidate = slug_count.positive? ? "#{name_slug}-#{slug_count + 1}" : name_slug
      self.slug = slug_candidate
    end

    def slug_not_changed
      if will_save_change_to_slug? && self.persisted?
        errors.add(:slug, I18n.t("quiz.slug.immutable"))
      end
    end
end
