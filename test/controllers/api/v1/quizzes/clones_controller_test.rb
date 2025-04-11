# frozen_string_literal: true

require "test_helper"

class Api::V1::Quizzes::ClonesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user)
    @quiz = create(:quiz, creator: @user)
    @auth_headers = { "Authorization" => "Bearer test_token" }
  end

  def test_clone_quiz
    assert_difference("Quiz.count", 1) do
      post clone_api_v1_quiz_url(@quiz.slug),
        headers: @auth_headers,
        as: :json
    end
    assert_response :success
    assert_equal "Quiz was successfully cloned!", JSON.parse(response.body)["notice"]

    cloned_quiz = Quiz.order(created_at: :desc).first
    assert_equal "Copy of #{@quiz.name}", cloned_quiz.name
    assert_not_equal @quiz.slug, cloned_quiz.slug
    assert_equal 0, cloned_quiz.submissions_count
  end

  def test_clone_quiz_with_multiple_copies
    # Create initial copies
    create(:quiz, name: "Copy of #{@quiz.name}", creator: @user)
    create(:quiz, name: "Copy of #{@quiz.name} (2)", creator: @user)

    assert_difference("Quiz.count", 1) do
      post clone_api_v1_quiz_url(@quiz.slug),
        headers: @auth_headers,
        as: :json
    end
    assert_response :success

    cloned_quiz = Quiz.order(created_at: :desc).first
    assert_equal "Copy of #{@quiz.name} (3)", cloned_quiz.name
  end

  def test_clone_quiz_with_questions
    # Create questions for the quiz
    create(:question, quiz: @quiz)
    create(:question, quiz: @quiz)

    assert_difference("Quiz.count", 1) do
      assert_difference("Question.count", 2) do
        post clone_api_v1_quiz_url(@quiz.slug),
          headers: @auth_headers,
          as: :json
      end
    end
    assert_response :success
  end

  def test_clone_quiz_with_invalid_slug
    invalid_slug = "invalid-slug"
    assert_no_difference("Quiz.count") do
      post clone_api_v1_quiz_url(invalid_slug),
        headers: @auth_headers,
        as: :json
    end
    assert_response :not_found
    assert_equal "Couldn't find Quiz", JSON.parse(response.body)["error"]
  end
end
