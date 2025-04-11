# frozen_string_literal: true

require "test_helper"

class Api::V1::Questions::ClonesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user)
    @quiz = create(:quiz)
    @question = create(:question, quiz: @quiz)
    @auth_headers = { "Authorization" => "Bearer test_token" }
  end

  def test_clone_question
    assert_difference("Question.count", 1) do
      post clone_api_v1_question_url(@question),
        headers: @auth_headers,
        as: :json
    end
    assert_response :success
    assert_equal "Question was successfully cloned!", JSON.parse(response.body)["notice"]
  end

  def test_clone_question_with_invalid_id
    invalid_id = SecureRandom.uuid
    assert_no_difference("Question.count") do
      post clone_api_v1_question_url(invalid_id),
        headers: @auth_headers,
        as: :json
    end
    assert_response :not_found
    assert_equal "Couldn't find Question", JSON.parse(response.body)["error"]
  end

  def test_clone_question_with_associated_data
    # Create associated options directly using the question's options array
    @question.options << { text: "Option 1", is_correct: false }
    @question.options << { text: "Option 2", is_correct: true }
    @question.save!

    assert_difference("Question.count", 1) do
      post clone_api_v1_question_url(@question),
        headers: @auth_headers,
        as: :json
    end
    assert_response :success
  end
end
