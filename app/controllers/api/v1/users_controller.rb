# frozen_string_literal: true

class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: [:create, :create_standard_user]

  def index
    users = User.all
    render status: :ok, json: { users: }
  end

  def create
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
          role: :standard, password: "standard_password",
          password_confirmation: "standard_password"))
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
