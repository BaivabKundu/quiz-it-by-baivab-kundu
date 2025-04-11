# frozen_string_literal: true

require "test_helper"

class SearchSubmissionServiceTest < ActiveSupport::TestCase
  def setup
    @user1 = create(:user, username: "john_doe")
    @user2 = create(:user, username: "jane_smith")
    @user3 = create(:user, username: "bob_johnson")

    @submission1 = create(:submission, user: @user1)
    @submission2 = create(:submission, user: @user2)
    @submission3 = create(:submission, user: @user3)

    @submissions = Submission.all
  end

  def test_returns_all_submissions_when_search_key_is_blank
    service = SearchSubmissionService.new(@submissions, "")
    result = service.process

    assert_equal 3, result.count
  end

  def test_returns_all_submissions_when_search_key_is_nil
    service = SearchSubmissionService.new(@submissions, nil)
    result = service.process

    assert_equal 3, result.count
  end

  def test_finds_submissions_by_exact_username_match
    service = SearchSubmissionService.new(@submissions, "john_doe")
    result = service.process

    assert_equal 1, result.count
    assert_includes result, @submission1
  end

  def test_finds_submissions_by_partial_username_match
    service = SearchSubmissionService.new(@submissions, "john")
    result = service.process

    assert_equal 2, result.count
    assert_includes result, @submission1
    assert_includes result, @submission3
  end

  def test_finds_submissions_case_insensitive
    service = SearchSubmissionService.new(@submissions, "JOHN_DOE")
    result = service.process

    assert_equal 1, result.count
    assert_includes result, @submission1
  end

  def test_returns_empty_when_no_matches
    service = SearchSubmissionService.new(@submissions, "alice")
    result = service.process

    assert_equal 0, result.count
  end
end
