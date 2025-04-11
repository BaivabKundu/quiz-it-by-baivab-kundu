# frozen_string_literal: true

require "test_helper"

class Api::V1::OrganizationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @organization = create(:organization)
    @organization_params = { organization: { name: "Updated Organization" } }
  end

  def test_show_returns_organization
    get api_v1_organization_url(@organization), as: :json
    assert_response :success
    assert_equal @organization.name, JSON.parse(response.body)["organization"]["name"]
  end

  def test_update_updates_organization
    patch api_v1_organization_url(@organization), params: @organization_params, as: :json
    assert_response :success
    assert_equal "Organization was successfully updated!", JSON.parse(response.body)["notice"]
    assert_equal "Updated Organization", @organization.reload.name
  end

  def test_update_returns_error_for_invalid_params
    invalid_params = { organization: { name: "" } }
    patch api_v1_organization_url(@organization), params: invalid_params, as: :json
    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body)["error"], "Name can't be blank"
  end
end
