# frozen_string_literal: true

class FilterQuizService
  def initialize(quizzes, filters)
    @quizzes = quizzes
    @filters = filters
  end

  def process
    return @quizzes if @filters.blank?

    filter_by_name
    filter_by_status
    filter_by_selected_categories

    @quizzes
  end

  private

    def filter_by_name
      return if @filters[:name].blank?

      @quizzes = @quizzes.where("name ILIKE ?", "%#{@filters[:name]}%")
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
