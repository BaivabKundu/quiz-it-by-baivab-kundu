# frozen_string_literal: true

class User < ApplicationRecord
  MAX_NAME_LENGTH = 50
  MIN_PASSWORD_LENGTH = 8

  attribute :role, :string, default: "standard"
  enum :role, { standard: "standard", admin: "admin" }, default: :admin

  belongs_to :organization, foreign_key: "organization_id", class_name: "Organization"

  has_many :quizzes, foreign_key: :creator_id, class_name: "Quiz"

  has_secure_password
  has_secure_token :authentication_token

  validates :username, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: MIN_PASSWORD_LENGTH }, if: :password_required
  validates :password_confirmation, presence: true, if: :password_required
  validates :organization, presence: true

  before_save :to_lowercase
  before_validation :assign_default_organization, on: :create

  private

    def to_lowercase
      email.downcase!
    end

    def password_required
      password_digest.nil? || !password.nil?
    end

    def assign_default_organization
      self.organization ||= Organization.first
    end
end
