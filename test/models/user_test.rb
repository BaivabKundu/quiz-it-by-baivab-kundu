# frozen_string_literal: true

require "test_helper"

class UserTest < ActiveSupport::TestCase
  def setup
    @organization = create(:organization)
    @user = build(:user, :admin, assigned_organization: @organization)
  end

  def test_username_cannot_be_blank
    @user.username = nil
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Username can't be blank"
  end

  def test_username_has_maximum_length
    @user.username = "a" * (User::MAX_NAME_LENGTH + 1)
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Username is too long (maximum is #{User::MAX_NAME_LENGTH} characters)"
  end

  def test_username_must_be_unique
    @user.save!
    duplicate_user = @user.dup
    duplicate_user.email = "new@example.com"
    assert_not duplicate_user.valid?
    assert_includes duplicate_user.errors.full_messages, "Username has already been taken"
  end

  def test_password_has_minimum_length
    @user.password = "a" * (User::MIN_PASSWORD_LENGTH - 1)
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Password is too short (minimum is #{User::MIN_PASSWORD_LENGTH} characters)"
  end

  def test_email_format_validation
    invalid_emails = ["test", "test@", "test.com", "@example.com"]
    invalid_emails.each do |email|
      @user.email = email
      assert_not @user.valid?
      assert_includes @user.errors.full_messages, "Email is invalid"
    end
  end

  def test_role_enum
    assert_equal "standard", User.roles[:standard]
    assert_equal "admin", User.roles[:admin]
  end

  def test_default_role_is_admin
    new_user = User.new
    assert_equal "admin", new_user.role
  end

  def test_belongs_to_organization
    assert_respond_to @user, :assigned_organization
  end

  def test_has_many_quizzes
    assert_respond_to @user, :assigned_quizzes
  end

  def test_email_is_downcased_before_save
    mixed_case_email = "Test@Example.com"
    @user.email = mixed_case_email
    @user.save!
    assert_equal mixed_case_email.downcase, @user.reload.email
  end

  def test_default_organization_assignment
    organization = Organization.create!(name: "Test Org")
    new_user = User.create!(
      username: "newuser",
      email: "new@example.com",
      password: "password123",
      password_confirmation: "password123"
    )
    assert_equal Organization.first, new_user.assigned_organization
  end

  def test_authentication_token_is_generated
    @user.save!
    assert_not_nil @user.authentication_token
  end

  def test_password_confirmation_validation
    @user.password_confirmation = "different_password"
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Password confirmation doesn't match Password"
  end

  def test_email_must_be_unique
    @user.save!
    duplicate_user = @user.dup
    duplicate_user.username = "new_username"
    assert_not duplicate_user.valid?
    assert_includes duplicate_user.errors.full_messages, "Email has already been taken"
  end

  def test_role_validation
    assert_raises(ArgumentError) do
      @user.role = "invalid_role"
    end
  end

  def test_organization_presence_validation
    User.skip_callback(:validation, :before, :assign_default_organization)

    @user.assigned_organization_id = nil
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Assigned organization can't be blank"

    User.set_callback(:validation, :before, :assign_default_organization)
  end

  def test_has_secure_password
    assert_respond_to @user, :password_digest
    assert_respond_to @user, :authenticate
  end

  def test_password_digest_is_required
    @user.password = nil
    @user.password_confirmation = nil
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Password can't be blank"
  end

  def test_email_is_required
    @user.email = nil
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Email can't be blank"
  end
end
