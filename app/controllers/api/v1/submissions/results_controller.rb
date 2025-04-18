# frozen_string_literal: true

class Api::V1::Submissions::ResultsController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: :show

  def show
    @result = ResultService.new(params, @current_organization).process!
  end
end
