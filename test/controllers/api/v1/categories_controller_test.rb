# frozen_string_literal: true

require "test_helper"

class Api::V1::CategoriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @category = create(:category)
    @category_params = { category: { name: "New Category" } }
  end

  def test_index_returns_all_categories
    get api_v1_categories_url, as: :json
    assert_response :success
    assert_equal Category.count, JSON.parse(response.body)["categories"].count
  end

  def test_create_creates_new_category
    assert_difference("Category.count", 1) do
      post api_v1_categories_url, params: @category_params, as: :json
    end
    assert_response :success
    assert_equal "Category was successfully created!", JSON.parse(response.body)["notice"]
  end

  def test_create_returns_error_for_invalid_params
    invalid_params = { category: { name: "" } }
    assert_no_difference("Category.count") do
      post api_v1_categories_url, params: invalid_params, as: :json
    end
    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body)["error"], "Name can't be blank"
  end
end
