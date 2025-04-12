# frozen_string_literal: true

class Api::V1::OrganizationsController < ApplicationController
  before_action :load_organization, only: [:index, :show]
  skip_before_action :authenticate_user_using_x_auth_token

  def index
  end

  def show
    render
  end

  def update
    @organization = Organization.find(params[:id])
    @organization.update!(organization_params)
    render_notice(t("successfully_updated", entity: "Organization"))
  end

  private

    def load_organization
      @organization = Organization.first
    end

    def organization_params
      params.require(:organization).permit(:name)
    end
end
