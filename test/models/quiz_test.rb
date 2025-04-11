# frozen_string_literal: true

require "test_helper"

class QuizTest < ActiveSupport::TestCase
  def setup
    @quiz = build(:quiz)
  end

  def test_valid_quiz
    assert @quiz.valid?
  end

  def test_name_presence_validation
    @quiz.name = nil
    assert_not @quiz.valid?
    assert_includes @quiz.errors.full_messages, "Name can't be blank"
  end

  def test_name_length_validation
    @quiz.name = "a" * (Quiz::MAX_NAME_LENGTH + 1)
    assert_not @quiz.valid?
    assert_includes @quiz.errors.full_messages, "Name is too long (maximum is #{Quiz::MAX_NAME_LENGTH} characters)"
  end

  def test_questions_count_validation
    @quiz.questions_count = -1
    assert_not @quiz.valid?
    assert_includes @quiz.errors.full_messages, "Questions count must be greater than or equal to 0"
  end

  def test_submissions_count_validation
    @quiz.submissions_count = -1
    assert_not @quiz.valid?
    assert_includes @quiz.errors.full_messages, "Submissions count must be greater than or equal to 0"
  end

  def test_slug_uniqueness_validation
    @quiz.save!
    duplicate_quiz = @quiz.dup
    duplicate_quiz.name = "New Quiz Name"
    assert_not duplicate_quiz.valid?
    assert_includes duplicate_quiz.errors.full_messages, "Slug has already been taken"
  end

  def test_slug_not_changed_validation
    @quiz.save!
    @quiz.slug = "new-slug"
    assert_not @quiz.valid?
    assert_includes @quiz.errors.full_messages, "Slug is immutable"
  end

  def test_belongs_to_category
    assert_respond_to @quiz, :category
  end

  def test_belongs_to_creator
    assert_respond_to @quiz, :creator
  end

  def test_belongs_to_organization
    assert_respond_to @quiz, :organization
  end

  def test_has_many_questions
    assert_respond_to @quiz, :questions
  end

  def test_has_many_submissions
    assert_respond_to @quiz, :submissions
  end

  def test_published_scope
    published_quiz = create(:quiz, status: "published")
    draft_quiz = create(:quiz, :draft)
    assert_includes Quiz.published, published_quiz
    assert_not_includes Quiz.published, draft_quiz
  end

  def test_draft_scope
    published_quiz = create(:quiz, status: "published")
    draft_quiz = create(:quiz, :draft)
    assert_includes Quiz.draft, draft_quiz
    assert_not_includes Quiz.draft, published_quiz
  end

  def test_set_slug_before_create
    quiz = build(:quiz, name: "Test Quiz")
    quiz.save!
    assert_equal "test-quiz", quiz.slug
  end

  def test_set_slug_with_duplicate_name
    create(:quiz, name: "Test Quiz")
    quiz = build(:quiz, name: "Test Quiz")
    quiz.save!
    assert_equal "test-quiz-2", quiz.slug
  end

  def test_default_status_is_draft
    quiz = Quiz.new
    assert_equal "draft", quiz.status
  end

  def test_default_accessibility_is_discoverable
    quiz = Quiz.new
    assert_equal "discoverable", quiz.accessibility
  end

  def test_status_enum
    assert_equal "draft", Quiz.statuses[:draft]
    assert_equal "published", Quiz.statuses[:published]
  end

  def test_accessibility_enum
    assert_equal "discoverable", Quiz.accessibilities[:discoverable]
    assert_equal "hidden", Quiz.accessibilities[:hidden]
  end

  def test_questions_dependent_destroy
    quiz = create(:quiz)
    question = create(:question, quiz: quiz)
    assert_difference("Question.count", -1) do
      quiz.destroy
    end
  end

  def test_submissions_dependent_destroy
    quiz = create(:quiz)
    submission = create(:submission, quiz: quiz)
    assert_difference("Submission.count", -1) do
      quiz.destroy
    end
  end

  def test_slug_generation_with_special_characters
    quiz = build(:quiz, name: "Test Quiz!@#$%^&*()")
    quiz.save!
    assert_equal "test-quiz", quiz.slug
  end

  def test_slug_generation_with_multiple_spaces
    quiz = build(:quiz, name: "Test    Quiz")
    quiz.save!
    assert_equal "test-quiz", quiz.slug
  end

  def test_slug_generation_with_existing_similar_slugs
    create(:quiz, name: "Test Quiz")
    create(:quiz, name: "Test Quiz 1")
    quiz = build(:quiz, name: "Test Quiz")
    quiz.save!
    assert_equal "test-quiz-2", quiz.slug
  end

  def test_slug_not_changed_on_update
    quiz = create(:quiz, name: "Test Quiz")
    original_slug = quiz.slug
    quiz.update(name: "New Quiz Name")
    assert_equal original_slug, quiz.slug
  end

  def test_status_validation
    assert_raises(ArgumentError) do
      quiz = build(:quiz, status: "invalid_status")
    end
  end

  def test_accessibility_validation
    assert_raises(ArgumentError) do
      quiz = build(:quiz, accessibility: "invalid_accessibility")
    end
  end
end
