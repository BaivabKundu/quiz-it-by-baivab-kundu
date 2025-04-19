# frozen_string_literal: true

class Api::V1::RedirectionsController < ApplicationController
  before_action :load_redirection, only: [:update, :destroy]

  def index
    @redirections = @current_organization.redirections
  end

  def create
    @current_organization.redirections.create!(redirection_params)
    render_notice(t("successfully_created", entity: "Redirection"))
  end

  def update
    @redirection.update!(redirection_params)
    render_notice(t("successfully_updated", entity: "Redirection"))
  end

  def destroy
    @redirection.destroy
    render_notice(t("successfully_deleted", entity: "Redirection"))
  end

  private

    def load_redirection
      @redirection = @current_organization.redirections.find(params[:id])
    end

    def redirection_params
      params.require(:redirection).permit(:source, :destination)
    end
end
