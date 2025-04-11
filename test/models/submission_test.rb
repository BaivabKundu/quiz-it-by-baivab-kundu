# frozen_string_literal: true

require "test_helper"

class SubmissionTest < ActiveSupport::TestCase
  def setup
    @submission = build(:submission)
  end

  def test_valid_submission
    assert @submission.valid?
  end

  def test_belongs_to_user
    assert_respond_to @submission, :user
  end

  def test_belongs_to_quiz
    assert_respond_to @submission, :quiz
  end

  def test_status_enum
    assert_equal "completed", Submission.statuses[:completed]
    assert_equal "incomplete", Submission.statuses[:incomplete]
  end

  def test_total_questions_validation
    @submission.total_questions = -1
    assert_not @submission.valid?
    assert_includes @submission.errors.full_messages, "Total questions must be greater than or equal to 0"
  end

  def test_correct_answers_count_validation
    @submission.correct_answers_count = -1
    assert_not @submission.valid?
    assert_includes @submission.errors.full_messages, "Correct answers count must be greater than or equal to 0"
  end

  def test_wrong_answers_count_validation
    @submission.wrong_answers_count = -1
    assert_not @submission.valid?
    assert_includes @submission.errors.full_messages, "Wrong answers count must be greater than or equal to 0"
  end

  def test_unanswered_count_validation
    @submission.unanswered_count = -1
    assert_not @submission.valid?
    assert_includes @submission.errors.full_messages, "Unanswered count must be greater than or equal to 0"
  end

  def test_quiz_counter_cache
    quiz = create(:quiz)
    assert_equal 0, quiz.submissions_count
    create(:submission, quiz: quiz)
    assert_equal 1, quiz.reload.submissions_count
  end

  def test_status_prefix
    submission = create(:submission, status: "completed")
    assert submission.status_completed?
    assert_not submission.status_incomplete?
  end

  def test_default_status_is_incomplete
    submission = Submission.new
    assert_equal "incomplete", submission.status
  end

  def test_answers_defaults_to_empty_array
    submission = Submission.new
    assert_equal [], submission.answers
  end

  def test_status_validation
    assert_raises(ArgumentError) do
      @submission.status = "invalid_status"
    end
  end

  def test_answers_can_be_empty
    @submission.answers = []
    assert @submission.valid?
  end

  def test_answers_can_contain_valid_data
    @submission.answers = [{ question_id: 1, answer_id: 2 }]
    assert @submission.valid?
  end

  def test_total_questions_must_be_integer
    @submission.total_questions = 1.5
    assert_not @submission.valid?
    assert_includes @submission.errors.full_messages, "Total questions must be an integer"
  end

  def test_correct_answers_count_must_be_integer
    @submission.correct_answers_count = 1.5
    assert_not @submission.valid?
    assert_includes @submission.errors.full_messages, "Correct answers count must be an integer"
  end

  def test_wrong_answers_count_must_be_integer
    @submission.wrong_answers_count = 1.5
    assert_not @submission.valid?
    assert_includes @submission.errors.full_messages, "Wrong answers count must be an integer"
  end

  def test_unanswered_count_must_be_integer
    @submission.unanswered_count = 1.5
    assert_not @submission.valid?
    assert_includes @submission.errors.full_messages, "Unanswered count must be an integer"
  end

  def test_user_association_validation
    @submission.user = nil
    assert_not @submission.valid?
    assert_includes @submission.errors.full_messages, "User must exist"
  end

  def test_quiz_association_validation
    @submission.quiz = nil
    assert_not @submission.valid?
    assert_includes @submission.errors.full_messages, "Quiz must exist"
  end
end
