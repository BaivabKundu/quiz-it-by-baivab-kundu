# frozen_string_literal: true

class FilterQuizService
  def initialize(quizzes, params)
    @quizzes = quizzes
    @filters = params[:filters]
    @search_key = params[:search_key]
    @status = params[:status]
    @accessibility = params[:accessibility]
  end

  def process
    filter_by_search_key
    filter_for_public_pages

    return @quizzes if @filters.blank?

    filter_by_name
    filter_by_status
    filter_by_selected_categories

    @quizzes
  end

  private

    def filter_for_public_pages
      return if @status.blank? || @status == "all"

      @quizzes = @quizzes.where(status: @status.downcase, accessibility: @accessibility.downcase)
    end

    def filter_by_search_key
      return if @search_key.blank?

      @quizzes = @quizzes.where("LOWER(quizzes.name) LIKE ?", "%#{@search_key.downcase}%")
    end

    def filter_by_name
      return if @filters[:name].blank?

      @quizzes = @quizzes.where("quizzes.name ILIKE ?", "%#{@filters[:name]}%")
    end

    def filter_by_status
      return if @filters[:status].blank?

      @quizzes = @quizzes.where(status: @filters[:status].downcase)
    end

    def filter_by_selected_categories
      return if @filters[:selected_categories].blank?

      category_names = @filters[:selected_categories].permit!.to_h.values
      @quizzes = @quizzes.joins(:category)
        .where(categories: { name: category_names })
    end
end
