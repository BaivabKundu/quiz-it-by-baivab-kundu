# frozen_string_literal: true

class FilterQuizService
  def initialize(quizzes, filters, search_key, status)
    @quizzes = quizzes
    @filters = filters
    @search_key = search_key
    @status = status
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

      @quizzes = @quizzes.where(status: @status.downcase)
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
