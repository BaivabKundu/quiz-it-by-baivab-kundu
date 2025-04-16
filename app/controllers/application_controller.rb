# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include ApiResponders
  include ApiExceptions
  include Authenticable
  include Pundit::Authorization

  before_action :set_current_organization

  private

    def current_user
      @current_user
    end

    def set_current_organization
      @current_organization = Organization.first
    end
end
