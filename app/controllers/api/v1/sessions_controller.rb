# frozen_string_literal: true

class Api::V1::SessionsController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token

  def create
    @user = User.find_by!(email: login_params[:email].downcase)
    unless @user.authenticate(login_params[:password])
      return render_error(t("session.incorrect_credentials"), :unauthorized)
    end

    unless @user.admin?
      render_error(t("session.unauthorized_access"), :unauthorized)
    end
  end

  def destroy
    @current_user = nil
  end

  private

    def login_params
      params.require(:login).permit(:email, :password)
    end
end
