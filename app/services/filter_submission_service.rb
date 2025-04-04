# frozen_string_literal: true

class FilterSubmissionService
  def initialize(submissions, filters)
    @submissions = submissions
    @filters = filters
  end

  def process
    return @submissions if @filters.blank?

    filter_by_name
    filter_by_email
    filter_by_status

    @submissions
  end

  private

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
