# frozen_string_literal: true

require "test_helper"

class Api::V1::SessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user, email: "test@example.com", password: "password123", password_confirmation: "password123")

    @valid_credentials = {
      login: {
        email: "test@example.com",
        password: "password123"
      }
    }

    @invalid_credentials = {
      login: {
        email: "test@example.com",
        password: "wrongpassword"
      }
    }
  end

  def test_create_session_with_valid_credentials
    post api_v1_session_url, params: @valid_credentials, as: :json
    assert_response :success
  end

  def test_create_session_with_invalid_credentials
    post api_v1_session_url, params: @invalid_credentials, as: :json
    assert_response :unauthorized
    assert_equal "Incorrect credentials, try again.", JSON.parse(response.body)["error"]
  end

  def test_create_session_with_missing_email
    invalid_params = @valid_credentials.deep_dup
    invalid_params[:login].delete(:email)

    post api_v1_session_url, params: invalid_params, as: :json

    assert_response :internal_server_error
    assert_includes JSON.parse(response.body)["error"], "undefined method `downcase'"
  end

  def test_create_session_with_missing_password
    invalid_params = @valid_credentials.deep_dup
    invalid_params[:login].delete(:password)

    post api_v1_session_url, params: invalid_params, as: :json
    assert_response :unauthorized
    assert_equal "Incorrect credentials, try again.", JSON.parse(response.body)["error"]
  end

  def test_destroy_session
    delete api_v1_session_url, as: :json
    assert_response :no_content
  end

  def test_create_session_with_non_admin_user
    non_admin_user = create(
      :user, email: "nonadmin@example.com", password: "password123",
      password_confirmation: "password123", role: "standard")
    credentials = {
      login: {
        email: "nonadmin@example.com",
        password: "password123"
      }
    }

    post api_v1_session_url, params: credentials, as: :json
    assert_response :unauthorized
    assert_equal I18n.t("session.unauthorized_access"), JSON.parse(response.body)["error"]
  end
end
