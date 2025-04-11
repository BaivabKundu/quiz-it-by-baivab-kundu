# frozen_string_literal: true

require "test_helper"

class Api::V1::SubmissionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user)
    @quiz = create(:quiz)
    @question = create(:question, quiz: @quiz)
    @submission = create(:submission, user: @user, quiz: @quiz)
    @auth_headers = { "Authorization" => "Bearer test_token" }
  end

  def test_index_returns_submissions
    get api_v1_submissions_url, params: { slug: @quiz.slug }, headers: @auth_headers, as: :json
    assert_response :success

    response_data = JSON.parse(response.body)
    assert_equal @quiz.submissions.count, response_data["submissions"].count
    assert_equal @quiz.name, response_data.dig("quiz", "name")
    assert_not_nil response_data["meta"]
  end

  def test_index_with_search_and_filters
    create(:submission, user: @user, quiz: @quiz, status: "completed")

    get api_v1_submissions_url,
      params: {
        slug: @quiz.slug,
        search_key: @user.username,
        filters: { status: "completed" }
      },
      headers: @auth_headers,
      as: :json

    assert_response :success
    response_data = JSON.parse(response.body)
    assert_equal 1, response_data["submissions"].count
  end

  def test_create_submission
    assert_difference("Submission.count", 1) do
      post api_v1_submissions_url,
        params: {
          slug: @quiz.slug,
          user_id: @user.id,
          submission: {
            status: "completed",
            answers: [
              { question_id: @question.id, selected_option_index: 0 }
            ]
          }
        },
        headers: @auth_headers,
        as: :json
    end
    assert_response :success
    assert_not_nil JSON.parse(response.body)["id"]
  end

  def test_create_submission_with_invalid_data
    assert_difference("Submission.count", 1) do
      post api_v1_submissions_url,
        params: {
          slug: @quiz.slug,
          user_id: @user.id,
          submission: {
            status: "incomplete",
            answers: []
          }
        },
        headers: @auth_headers,
        as: :json
    end
    assert_response :success
    assert_not_nil JSON.parse(response.body)["id"]
  end

  def test_update_submission
    patch api_v1_submission_url(@submission),
      params: {
        slug: @quiz.slug,
        user_id: @user.id,
        submission: {
          status: "completed",
          answers: [
            { question_id: @question.id, selected_option_index: 0 }
          ]
        }
      },
      headers: @auth_headers,
      as: :json

    assert_response :success
    assert_equal "Submission updated successfully!", JSON.parse(response.body)["notice"]
    assert_equal "completed", @submission.reload.status
  end

  def test_update_submission_with_invalid_data
    patch api_v1_submission_url(@submission),
      params: {
        slug: @quiz.slug,
        user_id: @user.id,
        submission: {
          status: "incomplete",
          answers: []
        }
      },
      headers: @auth_headers,
      as: :json

    assert_response :success
    assert_equal "Submission updated successfully!", JSON.parse(response.body)["notice"]
  end
end
