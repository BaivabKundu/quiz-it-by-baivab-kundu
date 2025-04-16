# frozen_string_literal: true

require "test_helper"

class Api::V1::QuizzesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @quiz = create(:quiz)
    @quiz_params = {
      quiz: {
        name: "New Quiz",
        status: "draft",
        accessibility: "discoverable",
        category_id: create(:category).id,
        organization_id: create(:organization).id,
        submissions_count: 0,
        creator_id: create(:user).id
      }
    }
    @bulk_update_params = {
      quizzes: {
        update_fields: { status: "draft" },
        id: [@quiz.id]
      }
    }
    @bulk_destroy_params = {
      quizzes: {
        id: [@quiz.id]
      }
    }
  end

  def test_index_returns_quizzes
    get api_v1_quizzes_url, as: :json
    assert_response :success
    assert_equal Quiz.count, JSON.parse(response.body)["quizzes"].count
  end

  def test_show_returns_quiz
    user = create(:user, role: "admin")
    quiz = create(:quiz, creator_id: user.id)

    headers = {
      "X-Auth-Email" => user.email,
      "X-Auth-Token" => user.authentication_token
    }

    get api_v1_quiz_url(quiz.slug), headers: headers, as: :json

    assert_response :success
    response_body = JSON.parse(response.body)

    assert_equal quiz.name, response_body["name"]
  end

  def test_create_creates_new_quiz
    assert_difference("Quiz.count", 1) do
      post api_v1_quizzes_url, params: @quiz_params, as: :json
    end
    assert_response :success
    assert_equal "Quiz was successfully created!", JSON.parse(response.body)["notice"]
  end

  def test_create_returns_error_for_invalid_params
    invalid_params = { quiz: { name: "" } }
    assert_no_difference("Quiz.count") do
      post api_v1_quizzes_url, params: invalid_params, as: :json
    end
    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body)["error"], "Name can't be blank"
  end

  def test_update_updates_quiz
    patch api_v1_quiz_url(@quiz.slug), params: @quiz_params, as: :json
    assert_response :success
    assert_equal "Quiz was successfully updated!", JSON.parse(response.body)["notice"]
    assert_equal "New Quiz", @quiz.reload.name
  end

  def test_update_returns_error_for_invalid_params
    invalid_params = { quiz: { name: "" } }
    patch api_v1_quiz_url(@quiz.slug), params: invalid_params, as: :json
    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body)["error"], "Name can't be blank"
  end

  def test_destroy_deletes_quiz
    assert_difference("Quiz.count", -1) do
      delete api_v1_quiz_url(@quiz.slug), as: :json
    end
    assert_response :success
    assert_equal "Quiz was successfully deleted!", JSON.parse(response.body)["notice"]
  end

  def test_bulk_update_updates_quizzes
    user = create(:user, role: "admin")
    quiz = create(:quiz, creator_id: user.id, status: "published")

    headers = {
      "X-Auth-Email" => user.email,
      "X-Auth-Token" => user.authentication_token
    }

    bulk_update_params = {
      quizzes: {
        id: [quiz.id],
        update_fields: {
          status: "draft"
        }
      }
    }

    put bulk_update_api_v1_quizzes_url,
      params: bulk_update_params,
      headers: headers,
      as: :json

    assert_response :success
    assert_equal "Quizzes was successfully updated!", JSON.parse(response.body)["notice"]
    assert_equal "draft", quiz.reload.status
  end

  def test_bulk_destroy_deletes_quizzes
    assert_difference("Quiz.count", -1) do
      delete bulk_destroy_api_v1_quizzes_url, params: @bulk_destroy_params, as: :json
    end
    assert_response :success
    assert_equal "Quizzes was successfully deleted!", JSON.parse(response.body)["notice"]
  end
end
