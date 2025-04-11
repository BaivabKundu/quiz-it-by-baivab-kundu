# frozen_string_literal: true

require "test_helper"

class QuizCloneServiceTest < ActiveSupport::TestCase
  def setup
    @quiz = create(:quiz, name: "Original Quiz")
    create_list(:question, 3, quiz: @quiz)
  end

  def test_clones_quiz_with_questions
    service = QuizCloneService.new(@quiz)
    cloned_quiz = service.process!

    assert_equal "Copy of Original Quiz", cloned_quiz.name
    assert_equal 3, cloned_quiz.questions.count
    assert_not_equal @quiz.slug, cloned_quiz.slug
    assert_equal 0, cloned_quiz.submissions_count
  end

  def test_increments_copy_number_when_multiple_copies_exist
    create(:quiz, name: "Copy of Original Quiz")
    create(:quiz, name: "Copy of Original Quiz (1)")

    service = QuizCloneService.new(@quiz)
    cloned_quiz = service.process!

    assert_equal "Copy of Original Quiz (3)", cloned_quiz.name
  end

  def test_handles_first_copy_correctly
    service = QuizCloneService.new(@quiz)
    cloned_quiz = service.process!

    assert_equal "Copy of Original Quiz", cloned_quiz.name
  end

  def test_resets_slug
    @quiz.update(slug: "original-quiz")
    service = QuizCloneService.new(@quiz)
    cloned_quiz = service.process!

    assert_not_equal @quiz.slug, cloned_quiz.slug
    assert_match(/^copy-of-original-quiz(-\w+)?$/, cloned_quiz.slug)
  end

  def test_resets_submissions_count
    @quiz.update(submissions_count: 5)
    service = QuizCloneService.new(@quiz)
    cloned_quiz = service.process!

    assert_equal 0, cloned_quiz.submissions_count
  end

  def test_preserves_questions
    service = QuizCloneService.new(@quiz)
    cloned_quiz = service.process!

    assert_equal @quiz.questions.count, cloned_quiz.questions.count
    assert_equal @quiz.questions.first.body, cloned_quiz.questions.first.body
  end
end
