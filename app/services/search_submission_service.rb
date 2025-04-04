# frozen_string_literal: true

class SearchSubmissionService
  def initialize(submissions, search_key)
    @submissions = submissions
    @search_key = search_key
  end

  def process
    return @submissions if @search_key.blank?

    @submissions.joins(:user).where("LOWER(users.username) LIKE ?", "%#{@search_key.downcase}%")
  end
end
