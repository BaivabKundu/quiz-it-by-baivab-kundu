# frozen_string_literal: true

class FilterSubmissionService
  def initialize(submissions, filters, search_key)
    @submissions = submissions
    @filters = filters
    @search_key = search_key
  end

  def process
    filter_by_search_key

    return @submissions if @filters.blank?

    filter_by_name
    filter_by_email
    filter_by_status

    @submissions
  end

  private

    def filter_by_search_key
      return @submissions if @search_key.blank?

      @submissions = @submissions.joins(:user).where("LOWER(users.username) LIKE ?", "%#{@search_key.downcase}%")
    end

    def filter_by_name
      return if @filters[:name].blank?

      @submissions = @submissions.joins(:user).where("LOWER(users.username) LIKE ?", "%#{@filters[:name].downcase}%")
    end

    def filter_by_email
      return if @filters[:email].blank?

      @submissions = @submissions.joins(:user).where("LOWER(users.email) LIKE ?", "%#{@filters[:email].downcase}%")
    end

    def filter_by_status
      return if @filters[:status].blank?

      @submissions = @submissions.where(status: @filters[:status].downcase)
    end
end
