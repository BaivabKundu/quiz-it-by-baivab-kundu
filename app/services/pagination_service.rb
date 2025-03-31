# frozen_string_literal: true

class PaginationService
  include Pagy::Backend

  def initialize(relation, params = {})
    @relation = relation
    @page = [params[:page].to_i, 1].max
    @per_page = Constants::DEFAULT_PER_PAGE
  end

  def paginate
    total_count = @relation.count
    total_pages = (total_count.to_f / @per_page).ceil

    @page = [[@page, 1].max, [total_pages, 1].max].min

    pagy, paginated_records = pagy(@relation, limit: @per_page, page: @page, items: @per_page)

    {
      records: paginated_records,
      meta: {
        current_page: pagy.page,
        total_pages: pagy.pages,
        total_count: pagy.count,
        items_per_page: @per_page,
        next_page: pagy.next,
        prev_page: pagy.prev
      }
    }
  end
end
