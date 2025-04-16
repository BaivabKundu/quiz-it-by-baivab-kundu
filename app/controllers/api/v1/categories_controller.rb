# frozen_string_literal: true

class Api::V1::CategoriesController < ApplicationController
  def index
    @categories = @current_organization.categories
  end

  def create
    @current_organization.categories.create!(category_params)
    render_notice(t("successfully_created", entity: "Category"))
  end

  private

    def category_params
      params.require(:category).permit(:name)
    end
end
