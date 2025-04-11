# frozen_string_literal: true

require "test_helper"

class PaginationServiceTest < ActiveSupport::TestCase
  def setup
    # Create test data using factories
    create_list(:quiz, 15, :published)
    create_list(:quiz, 5, :draft)
    @quizzes = Quiz.all
  end

  def test_paginates_with_default_per_page
    service = PaginationService.new(@quizzes)
    result = service.paginate

    assert_equal Constants::DEFAULT_PER_PAGE, result[:records].count
    assert_equal Constants::DEFAULT_PER_PAGE, result[:meta][:items_per_page]
    assert_equal 1, result[:meta][:current_page]
    assert_equal (20.0 / Constants::DEFAULT_PER_PAGE).ceil, result[:meta][:total_pages]
    assert_equal 20, result[:meta][:total_count]
    assert_equal 15, result[:meta][:published_count]
    assert_equal 5, result[:meta][:draft_count]
  end

  def test_paginates_with_specific_page
    service = PaginationService.new(@quizzes, page: 2)
    result = service.paginate

    assert_equal Constants::DEFAULT_PER_PAGE, result[:records].count
    assert_equal 2, result[:meta][:current_page]
    assert_equal (20.0 / Constants::DEFAULT_PER_PAGE).ceil, result[:meta][:total_pages]
  end

  def test_handles_page_number_greater_than_total_pages
    service = PaginationService.new(@quizzes, page: 100)
    result = service.paginate

    assert_equal (20.0 / Constants::DEFAULT_PER_PAGE).ceil, result[:meta][:current_page]
  end

  def test_handles_page_number_less_than_one
    service = PaginationService.new(@quizzes, page: -1)
    result = service.paginate

    assert_equal 1, result[:meta][:current_page]
  end

  def test_returns_empty_collection_when_no_records
    Quiz.destroy_all
    service = PaginationService.new(Quiz.all)
    result = service.paginate

    assert_equal 0, result[:records].count
    assert_equal 0, result[:meta][:total_count]
    assert_equal 1, result[:meta][:total_pages]
  end

  def test_does_not_include_published_draft_counts_for_non_quiz_relations
    users = create_list(:user, 5)
    service = PaginationService.new(User.where(id: users.map(&:id)))
    result = service.paginate

    assert_equal 5, result[:records].count
    assert_nil result[:meta][:published_count]
    assert_nil result[:meta][:draft_count]
  end
end
