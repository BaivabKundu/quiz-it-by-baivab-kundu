# frozen_string_literal: true

require "test_helper"

class ApiExceptionsTest < ActionDispatch::IntegrationTest
  class TestController < ApplicationController
    include ApiExceptions

    def raise_database_error
      raise ActiveRecord::StatementInvalid.new("PG::Error: something went wrong")
    end

    def raise_authorization_error
      raise Pundit::NotAuthorizedError
    end

    def raise_parameter_missing
      raise ActionController::ParameterMissing.new(:param)
    end

    def raise_record_not_found
      raise ActiveRecord::RecordNotFound.new("User")
    end

    def raise_record_not_unique
      raise ActiveRecord::RecordNotUnique.new("Duplicate entry")
    end

    def raise_validation_error
      user = User.new
      user.errors.add(:base, "Validation failed")
      raise ActiveModel::ValidationError.new(user)
    end

    def raise_generic_error
      raise StandardError.new("Something went wrong")
    end
  end

  setup do
    Rails.application.routes.draw do
      if Rails.env.test?
        get "database_error", to: "api_exceptions_test/test#raise_database_error"
        get "authorization_error", to: "api_exceptions_test/test#raise_authorization_error"
        get "parameter_missing", to: "api_exceptions_test/test#raise_parameter_missing"
        get "record_not_found", to: "api_exceptions_test/test#raise_record_not_found"
        get "record_not_unique", to: "api_exceptions_test/test#raise_record_not_unique"
        get "validation_error", to: "api_exceptions_test/test#raise_validation_error"
        get "generic_error", to: "api_exceptions_test/test#raise_generic_error"
      end
    end
  end

  def test_handles_database_level_exception
    get "/database_error"
    assert_response :internal_server_error
    assert_equal "PG::Error: something went wrong", JSON.parse(response.body)["error"]
  end

  def test_handles_authorization_error
    get "/authorization_error"
    assert_response :forbidden
    assert_equal "Access denied. You are not authorized to perform this action.", JSON.parse(response.body)["error"]
  end

  def test_handles_parameter_missing
    get "/parameter_missing"
    assert_response :internal_server_error
    assert_equal "param is missing or the value is empty: param", JSON.parse(response.body)["error"]
  end

  def test_handles_record_not_found
    get "/record_not_found"
    assert_response :not_found
    assert_equal "Couldn't find ", JSON.parse(response.body)["error"]
  end

  def test_handles_record_not_unique
    get "/record_not_unique"
    assert_response :unprocessable_entity
    assert_equal "Duplicate entry", JSON.parse(response.body)["error"]
  end

  def test_handles_validation_error
    get "/validation_error"
    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body)["error"], "Validation failed"
  end

  def test_handles_generic_error
    get "/generic_error"
    assert_response :internal_server_error
    assert_equal "Something went wrong", JSON.parse(response.body)["error"]
  end

  def test_logs_exception_details
    exception = StandardError.new("Test error")
    exception.set_backtrace(["backtrace line 1", "backtrace line 2"])

    logger = mock("logger")
    logger.expects(:info).with("StandardError")
    logger.expects(:info).with("Test error")
    logger.expects(:info).with("backtrace line 1\nbacktrace line 2")

    Rails.stubs(:logger).returns(logger)

    TestController.new.send(:log_exception, exception)
  end
end
