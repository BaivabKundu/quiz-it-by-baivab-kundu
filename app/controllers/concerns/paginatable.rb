# frozen_string_literal: true

module Paginatable
  extend ActiveSupport::Concern
  include Pagy::Backend

  def paginate(relation, params = {})
    page = [params[:page].to_i, 1].max
    per_page = Constants::DEFAULT_PER_PAGE

    total_count = relation.count
    total_pages = (total_count.to_f / per_page).ceil
    page = [[page, 1].max, [total_pages, 1].max].min

    pagy, paginated_records = pagy(relation, limit: per_page, page: page, items: per_page)

    meta = build_meta(pagy, per_page, relation)

    instance_variable_set("@#{relation.model.name.underscore.pluralize}", paginated_records)
    @meta = meta
    @total_quizzes = params[:total_quizzes]
    @published_quizzes = params[:published_quizzes]
    @draft_quizzes = params[:draft_quizzes]
  end

  private

    def build_meta(pagy, per_page, relation)
      meta = {
        current_page: pagy.page,
        total_pages: pagy.pages,
        total_count: pagy.count,
        items_per_page: per_page,
        next_page: pagy.next,
        prev_page: pagy.prev
      }

      meta
    end
end
