# frozen_string_literal: true

require "test_helper"

class CategoryTest < ActiveSupport::TestCase
  def setup
    @category = build(:category)
  end

  def test_valid_category
    assert @category.valid?
  end

  def test_name_presence_validation
    @category.name = nil
    assert_not @category.valid?
    assert_includes @category.errors.full_messages, "Name can't be blank"
  end

  def test_name_uniqueness_validation
    @category.save!
    duplicate_category = @category.dup
    assert_not duplicate_category.valid?
    assert_includes duplicate_category.errors.full_messages, "Name has already been taken"
  end

  def test_name_length_validation
    @category.name = "a" * (Category::MAX_NAME_LENGTH + 1)
    assert_not @category.valid?
    assert_includes @category.errors.full_messages, "Name is too long (maximum is #{Category::MAX_NAME_LENGTH} characters)"
  end

  def test_has_many_assigned_quizzes
    assert_respond_to @category, :assigned_quizzes
  end

  def test_assigned_quizzes_association
    @category.save!
    quiz = create(:quiz, category: @category)
    assert_includes @category.reload.assigned_quizzes, quiz
  end
end
