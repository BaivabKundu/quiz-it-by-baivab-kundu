# frozen_string_literal: true

require "test_helper"

class EvaluationServiceTest < ActiveSupport::TestCase
  def setup
    @user = create(:user)
    @quiz = create(:quiz, creator: @user)
    @question = create(:question, quiz: @quiz)

    @params = ActionController::Parameters.new(
      {
        slug: @quiz.slug,
        user_id: @user.id,
        submission: {
          status: "completed",
          answers: [
                {
                  question_id: @question.id,
                  selected_option_index: 0
                }
              ]
        }
      })
  end

  def test_build_and_evaluate_new_submission
    @params[:submission][:answers][0][:selected_option_index] = @question.answer_id - 1

    service = EvaluationService.new(@params)
    submission = service.process!

    assert_equal @user, submission.user
    assert_equal @quiz, submission.quiz
    assert_equal "completed", submission.status
    assert_equal 1, submission.total_questions
    assert_equal 1, submission.correct_answers_count
    assert_equal 0, submission.wrong_answers_count
    assert_equal 0, submission.unanswered_count
  end

  def test_update_and_evaluate_existing_submission
    @params[:submission][:answers][0][:selected_option_index] = @question.answer_id - 1

    existing_submission = Submission.create!(
      user: @user,
      quiz: @quiz,
      status: "incomplete",
      answers: []
    )

    service = EvaluationService.new(@params, existing_submission)
    submission = service.process!

    assert_equal existing_submission.id, submission.id
    assert_equal "completed", submission.status
    assert_equal 1, submission.total_questions
    assert_equal 1, submission.correct_answers_count
  end

  def test_count_wrong_answers_correctly
    @params[:submission][:answers][0][:selected_option_index] = 1
    service = EvaluationService.new(@params)
    submission = service.process!

    assert_equal 0, submission.correct_answers_count
    assert_equal 1, submission.wrong_answers_count
  end

  def test_count_unanswered_questions
    @params[:submission][:answers] = []
    service = EvaluationService.new(@params)
    submission = service.process!

    assert_equal 0, submission.correct_answers_count
    assert_equal 0, submission.wrong_answers_count
    assert_equal 1, submission.unanswered_count
  end

  def test_raise_error_with_invalid_quiz_slug
    @params[:slug] = "invalid-slug"
    service = EvaluationService.new(@params)

    assert_raises(ActiveRecord::RecordNotFound) do
      service.process!
    end
  end

  def test_raise_error_with_invalid_user_id
    @params[:user_id] = 999
    service = EvaluationService.new(@params)

    assert_raises(ActiveRecord::RecordNotFound) do
      service.process!
    end
  end
end
