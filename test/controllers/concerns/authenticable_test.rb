# frozen_string_literal: true

require "test_helper"

class AuthenticableTest < ActionDispatch::IntegrationTest
  class ::TestAuthenticableController < ActionController::API
    include Authenticable
    include ActionView::Helpers::TranslationHelper

    before_action :authenticate_user_using_x_auth_token

    def index
      render json: {
        message: "Success",
        current_user_id: current_user&.id
      }
    end

    private

      def render_error(message, status = :unprocessable_entity)
        render json: { error: message }, status: status
      end
  end

  setup do
    @user = create(:user)

    Rails.application.routes.disable_clear_and_finalize = true
    Rails.application.routes.draw do
      get "/test_auth", to: "test_authenticable#index"
    end
    Rails.application.routes_reloader.execute_if_updated
  end

  def test_authenticates_with_valid_credentials
    get "/test_auth", headers: {
      "X-Auth-Email" => @user.email,
      "X-Auth-Token" => @user.authentication_token
    }
    assert_response :success
    assert_equal "Success", JSON.parse(response.body)["message"]
  end

  def test_rejects_partial_credentials
    get "/test_auth", headers: { "X-Auth-Email" => @user.email }
    assert_response :unauthorized
    assert_equal "Could not authenticate with the provided credentials.", JSON.parse(response.body)["error"]
  end

  def test_rejects_invalid_token
    get "/test_auth", headers: {
      "X-Auth-Email" => @user.email,
      "X-Auth-Token" => "invalid_token"
    }
    assert_response :unauthorized
    assert_equal "Could not authenticate with the provided credentials.", JSON.parse(response.body)["error"]
  end

  def test_rejects_invalid_email
    get "/test_auth", headers: {
      "X-Auth-Email" => "invalid@example.com",
      "X-Auth-Token" => @user.authentication_token
    }
    assert_response :unauthorized
    assert_equal "Could not authenticate with the provided credentials.", JSON.parse(response.body)["error"]
  end

  def test_sets_current_user
    get "/test_auth", headers: {
      "X-Auth-Email" => @user.email,
      "X-Auth-Token" => @user.authentication_token
    }
    assert_response :success
    assert_equal @user.id, JSON.parse(response.body)["current_user_id"]
  end
end
