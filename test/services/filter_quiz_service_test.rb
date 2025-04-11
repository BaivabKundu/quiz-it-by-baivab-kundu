# frozen_string_literal: true

require "test_helper"

class FilterQuizServiceTest < ActiveSupport::TestCase
  def setup
    @category1 = create(:category, name: "Science")
    @category2 = create(:category, name: "Math")

    @quiz1 = create(
      :quiz,
      name: "Basic Science Quiz",
      status: "published",
      category: @category1
    )
    @quiz2 = create(
      :quiz,
      name: "Advanced Math Quiz",
      status: "draft",
      category: @category2
    )
    @quiz3 = create(
      :quiz,
      name: "General Knowledge Quiz",
      status: "published",
      category: @category1
    )

    @quizzes = Quiz.all
  end

  def test_returns_all_quizzes_when_no_filters
    service = FilterQuizService.new(@quizzes, {})
    result = service.process

    assert_equal 3, result.count
  end

  def test_filters_by_name
    filters = { name: "science" }
    service = FilterQuizService.new(@quizzes, filters)
    result = service.process

    assert_equal 1, result.count
    assert_equal @quiz1.id, result.first.id
  end

  def test_filters_by_status
    filters = { status: "published" }
    service = FilterQuizService.new(@quizzes, filters)
    result = service.process

    assert_equal 2, result.count
    assert_includes result, @quiz1
    assert_includes result, @quiz3
  end

  def test_filters_by_selected_categories
    filters = { selected_categories: ActionController::Parameters.new({ '0': @category1.name }) }
    service = FilterQuizService.new(@quizzes, filters)
    result = service.process

    assert_equal 2, result.count
    assert_includes result, @quiz1
    assert_includes result, @quiz3
  end

  def test_filters_by_multiple_categories
    filters = { selected_categories: ActionController::Parameters.new({ '0': @category1.name, '1': @category2.name }) }
    service = FilterQuizService.new(@quizzes, filters)
    result = service.process

    assert_equal 3, result.count
  end

  def test_combines_multiple_filters
    filters = {
      name: "quiz",
      status: "published",
      selected_categories: ActionController::Parameters.new({ '0': @category1.name })
    }
    service = FilterQuizService.new(@quizzes, filters)
    result = service.process

    assert_equal 2, result.count
    assert_includes result, @quiz1
    assert_includes result, @quiz3
  end

  def test_handles_empty_selected_categories
    filters = { selected_categories: ActionController::Parameters.new({}) }
    service = FilterQuizService.new(@quizzes, filters)
    result = service.process

    assert_equal 3, result.count
  end

  def test_handles_blank_filters
    filters = {
      name: "",
      status: "",
      selected_categories: ActionController::Parameters.new({})
    }
    service = FilterQuizService.new(@quizzes, filters)
    result = service.process

    assert_equal 3, result.count
  end
end
