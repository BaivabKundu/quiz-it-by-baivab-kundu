# frozen_string_literal: true

require "test_helper"

class ApplicationRecordTest < ActiveSupport::TestCase
  class TestModel < ApplicationRecord
    self.table_name = "users" # Use the actual 'users' table
    validates :username, presence: true
    validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  end

  def setup
    @model = TestModel.new
  end

  def test_errors_to_sentence_with_no_errors
    @model.assign_attributes(username: "John Doe", email: "john@example.com")
    @model.valid?
    assert_equal "", @model.errors_to_sentence
  end

  def test_errors_to_sentence_with_one_error
    @model.assign_attributes(email: "john@example.com")
    @model.valid?
    assert_equal "Username can't be blank", @model.errors_to_sentence
  end

  def test_errors_to_sentence_with_multiple_errors
    @model.assign_attributes(email: "invalid-email")
    @model.valid?
    assert_equal "Username can't be blank and Email is invalid", @model.errors_to_sentence
  end

  def test_errors_to_sentence_without_validation_call
    assert_equal "", @model.errors_to_sentence
  end
end
