# frozen_string_literal: true

class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: [:create, :create_standard_user]
  before_action :load_users, only: [:index, :create, :create_standard_user]

  def index
    users = @users
    render status: :ok, json: { users: }
  end

  def create
    if @users.exists?(email: user_params[:email].downcase)
      render_error(t("authorization.user_email_already_exists"), :unauthorized)
      return
    end

    @users.create!(user_params)
    render_notice(t("successfully_created", entity: "User"))
  end

  def create_standard_user
    user = @users.find_by(email: user_params[:email])
    if user.present?
      if user.admin?
        render_error(t("authorization.admin_user_exists"), :unauthorized)
        nil
      else
        @user = user
      end
    else
      user = @current_organization.users.create!(
        user_params.merge(
          role: :standard, password: "welcome1234",
          password_confirmation: "welcome1234"))
      @user = user
    end
  end

  private

    def load_users
      @users = @current_organization.users.all
    end

    def user_params
      params.require(:user).permit(
        :username,
        :email,
        :password,
        :password_confirmation,
        :role,
      )
    end
end
