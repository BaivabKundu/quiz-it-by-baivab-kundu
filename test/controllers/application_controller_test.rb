# frozen_string_literal: true

require "test_helper"

class ApplicationControllerTest < ActionDispatch::IntegrationTest
  class TestController < ApplicationController
    def index
      render json: { message: "Success", current_user_id: current_user&.id }
    end
  end

  setup do
    @routes = ActionDispatch::Routing::RouteSet.new
    @routes.draw do
      get "test" => "application_controller_test/test#index"
    end
    @test_url = "http://www.example.com/test"
  end

  def test_includes_api_responders
    assert_includes ApplicationController.ancestors, ApiResponders
  end

  def test_includes_api_exceptions
    assert_includes ApplicationController.ancestors, ApiExceptions
  end

  def test_includes_authenticable
    assert_includes ApplicationController.ancestors, Authenticable
  end

  def test_includes_pundit_authorization
    assert_includes ApplicationController.ancestors, Pundit::Authorization
  end

  def test_current_user_method
    user = create(:user)
    controller = ApplicationController.new
    controller.instance_variable_set(:@current_user, user)
    assert_equal user, controller.send(:current_user)
  end
end
