# frozen_string_literal: true

class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: [:create, :create_standard_user]

  def index
    users = User.all
    render status: :ok, json: { users: }
  end

  def create
    if User.exists?(email: user_params[:email].downcase)
      render_error(t("authorization.user_email_already_exists"), :unauthorized)
      return
    end
    if User.exists?(username: user_params[:username])
      render_error(t("authorization.username_already_exists"), :unauthorized)
      return
    end

    user = User.new(user_params)
    user.save!
    render_notice(t("successfully_created", entity: "User"))
  end

  def create_standard_user
    user = User.find_by(email: user_params[:email], username: user_params[:username])
    if user.present?
      if user.admin?

      else
        @user = user
      end
    else
      user = User.new(
        user_params.merge(
          role: :standard, password: "welcome1234",
          password_confirmation: "welcome1234"))
      user.save!
      @user = user
    end
    render
  end

  private

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
