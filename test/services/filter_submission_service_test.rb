# frozen_string_literal: true

require "test_helper"

class FilterSubmissionServiceTest < ActiveSupport::TestCase
  def setup
    @user1 = create(:user, username: "john_doe", email: "john@example.com")
    @user2 = create(:user, username: "jane_smith", email: "jane@example.com")

    @submission1 = create(:submission, :completed, user: @user1)
    @submission2 = create(:submission, user: @user2, status: "incomplete")
    @submission3 = create(:submission, user: @user1, status: "incomplete")

    @submissions = Submission.all
  end

  def test_returns_all_submissions_when_no_filters
    service = FilterSubmissionService.new(@submissions, {})
    result = service.process

    assert_equal 3, result.count
  end

  def test_filters_by_name
    filters = { name: "john" }
    service = FilterSubmissionService.new(@submissions, filters)
    result = service.process

    assert_equal 2, result.count
    assert_includes result, @submission1
    assert_includes result, @submission3
  end

  def test_filters_by_email
    filters = { email: "jane" }
    service = FilterSubmissionService.new(@submissions, filters)
    result = service.process

    assert_equal 1, result.count
    assert_includes result, @submission2
  end

  def test_filters_by_status
    filters = { status: "completed" }
    service = FilterSubmissionService.new(@submissions, filters)
    result = service.process

    assert_equal 1, result.count
    assert_includes result, @submission1
  end

  def test_combines_multiple_filters
    filters = {
      name: "john",
      status: "incomplete"
    }
    service = FilterSubmissionService.new(@submissions, filters)
    result = service.process

    assert_equal 1, result.count
    assert_includes result, @submission3
  end

  def test_handles_blank_filters
    filters = {
      name: "",
      email: "",
      status: ""
    }
    service = FilterSubmissionService.new(@submissions, filters)
    result = service.process

    assert_equal 3, result.count
  end

  def test_handles_case_insensitive_filters
    filters = {
      name: "JOHN",
      email: "EXAMPLE"
    }
    service = FilterSubmissionService.new(@submissions, filters)
    result = service.process

    assert_equal 2, result.count
    assert_includes result, @submission1
    assert_includes result, @submission3
  end
end
