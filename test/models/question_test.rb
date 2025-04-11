# frozen_string_literal: true

require "test_helper"

class QuestionTest < ActiveSupport::TestCase
  def setup
    @question = build(:question)
  end

  def test_valid_question
    assert @question.valid?
  end

  def test_body_presence_validation
    @question.body = nil
    assert_not @question.valid?
    assert_includes @question.errors.full_messages, "Body can't be blank"
  end

  def test_options_presence_validation
    @question.options = nil
    assert_not @question.valid?
    assert_includes @question.errors.full_messages, "Options can't be blank"
  end

  def test_answer_id_presence_validation
    @question.answer_id = nil
    assert_not @question.valid?
    assert_includes @question.errors.full_messages, "Answer can't be blank"
  end

  def test_belongs_to_quiz
    assert_respond_to @question, :quiz
  end

  def test_set_quiz_to_draft_if_published_on_create
    quiz = create(:quiz, status: "published")
    question = build(:question, quiz: quiz)
    question.save!
    assert_equal "draft", quiz.reload.status
  end

  def test_set_quiz_to_draft_if_published_on_update
    quiz = create(:quiz, status: "published")
    question = create(:question, quiz: quiz)
    question.update!(body: "Updated body")
    assert_equal "draft", quiz.reload.status
  end

  def test_quiz_counter_cache
    quiz = create(:quiz)
    assert_equal 0, quiz.questions_count
    create(:question, quiz: quiz)
    assert_equal 1, quiz.reload.questions_count
  end

  def test_quiz_touch_on_question_update
    quiz = create(:quiz)
    question = create(:question, quiz: quiz)
    original_updated_at = quiz.updated_at
    question.update!(body: "Updated body")
    assert_not_equal original_updated_at, quiz.reload.updated_at
  end

  def test_answer_id_must_be_present
    @question.answer_id = nil
    assert_not @question.valid?
    assert_includes @question.errors.full_messages, "Answer can't be blank"
  end

  def test_options_must_be_present
    @question.options = nil
    assert_not @question.valid?
    assert_includes @question.errors.full_messages, "Options can't be blank"
  end

  def test_deep_cloneable
    quiz = create(:quiz)
    question = create(:question, quiz: quiz)
    cloned_question = question.deep_clone
    assert cloned_question.valid?
    assert_equal question.body, cloned_question.body
    assert_not_equal question.id, cloned_question.id
  end

  def test_quiz_status_remains_draft_when_already_draft
    quiz = create(:quiz, status: "draft")
    question = build(:question, quiz: quiz)
    question.save!
    assert_equal "draft", quiz.reload.status
  end

  def test_quiz_status_remains_draft_on_update_when_already_draft
    quiz = create(:quiz, status: "draft")
    question = create(:question, quiz: quiz)
    question.update!(body: "Updated body")
    assert_equal "draft", quiz.reload.status
  end
end
