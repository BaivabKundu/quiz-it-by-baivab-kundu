# frozen_string_literal: true

require "test_helper"

class SearchQuizServiceTest < ActiveSupport::TestCase
  def setup
    @quiz1 = create(:quiz, name: "Basic Science Quiz")
    @quiz2 = create(:quiz, name: "Advanced Math Quiz")
    @quiz3 = create(:quiz, name: "General Knowledge Quiz")

    @quizzes = Quiz.all
  end

  def test_returns_all_quizzes_when_search_key_is_blank
    service = SearchQuizService.new(@quizzes, "")
    result = service.process

    assert_equal 3, result.count
  end

  def test_returns_all_quizzes_when_search_key_is_nil
    service = SearchQuizService.new(@quizzes, nil)
    result = service.process

    assert_equal 3, result.count
  end

  def test_finds_quizzes_by_exact_match
    service = SearchQuizService.new(@quizzes, "Basic Science Quiz")
    result = service.process

    assert_equal 1, result.count
    assert_includes result, @quiz1
  end

  def test_finds_quizzes_by_partial_match
    service = SearchQuizService.new(@quizzes, "science")
    result = service.process

    assert_equal 1, result.count
    assert_includes result, @quiz1
  end

  def test_finds_quizzes_case_insensitive
    service = SearchQuizService.new(@quizzes, "BASIC SCIENCE")
    result = service.process

    assert_equal 1, result.count
    assert_includes result, @quiz1
  end

  def test_returns_empty_when_no_matches
    service = SearchQuizService.new(@quizzes, "History")
    result = service.process

    assert_equal 0, result.count
  end
end
