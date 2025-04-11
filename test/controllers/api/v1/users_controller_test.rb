# frozen_string_literal: true

require "test_helper"

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @admin_user = create(:user, :admin)
    @standard_user = create(:user, :standard)
    @user_params = {
      user: {
        username: "newuser",
        email: "newuser@example.com",
        password: "securepass",
        password_confirmation: "securepass",
        role: "standard"
      }
    }
    @headers = {
      "Authorization" => "Bearer #{@admin_user.authentication_token}",
      "Accept" => "application/json",
      "Content-Type" => "application/json"
    }
  end

  def test_index_returns_all_users
    get api_v1_users_url, headers: @headers
    assert_response :success
    response_body = JSON.parse(response.body)
    assert_includes response_body["users"].map { |user| user["id"] }, @standard_user.id
  end

  def test_create_creates_new_user
    assert_difference("User.count", 1) do
      post api_v1_users_url, params: @user_params.to_json, headers: @headers
    end
    assert_response :success
    assert_equal "User was successfully created!", JSON.parse(response.body)["notice"]
  end

  def test_create_with_invalid_params
    @user_params[:user][:email] = nil
    assert_no_difference("User.count") do
      post api_v1_users_url, params: @user_params.to_json, headers: @headers
    end
    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body)["error"], "Email can't be blank"
  end

  def test_create_standard_user_creates_new_standard_user
    assert_difference("User.count", 1) do
      post create_standard_user_api_v1_users_url, params: {
        user: {
          username: "standarduser",
          email: "standard@example.com"
        }
      }.to_json, headers: @headers
    end
    assert_response :success
    response_body = JSON.parse(response.body)
    assert_equal "standarduser", response_body["username"]
    assert_equal "standard", response_body["role"]
  end

  def test_create_standard_user_returns_existing_standard_user
    assert_no_difference("User.count") do
      post create_standard_user_api_v1_users_url, params: {
        user: {
          username: @standard_user.username,
          email: @standard_user.email
        }
      }.to_json, headers: @headers
    end
    assert_response :success
    response_body = JSON.parse(response.body)
    assert_equal @standard_user.id, response_body["id"]
  end
end
