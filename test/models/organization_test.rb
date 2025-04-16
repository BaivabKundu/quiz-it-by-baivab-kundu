# frozen_string_literal: true

require "test_helper"

class OrganizationTest < ActiveSupport::TestCase
  def setup
    @organization = build(:organization)
  end

  def test_valid_organization
    assert @organization.valid?
  end

  def test_name_presence_validation
    @organization.name = nil
    assert_not @organization.valid?
    assert_includes @organization.errors.full_messages, "Name can't be blank"
  end

  def test_name_uniqueness_validation
    @organization.save!
    duplicate_organization = @organization.dup
    assert_not duplicate_organization.valid?
    assert_includes duplicate_organization.errors.full_messages, "Name has already been taken"
  end

  def test_name_length_validation
    @organization.name = "a" * (Organization::MAX_NAME_LENGTH + 1)
    assert_not @organization.valid?
    assert_includes @organization.errors.full_messages, "Name is too long (maximum is #{Organization::MAX_NAME_LENGTH} characters)"
  end

  def test_has_many_users
    assert_respond_to @organization, :users
  end

  def test_has_many_quizzes
    assert_respond_to @organization, :quizzes
  end

  def test_users_association
    @organization.save!
    user = create(:user, organization: @organization)
    assert_includes @organization.reload.users, user
  end

  def test_quizzes_association
    @organization.save!
    quiz = create(:quiz, organization: @organization)
    assert_includes @organization.reload.quizzes, quiz
  end
end
