# frozen_string_literal: true

module Redirectable
  extend ActiveSupport::Concern

  included do
    before_action :handle_redirection
  end

  private

    def handle_redirection
      return unless @current_organization

      source_url = request.original_url
      redirection = @current_organization.redirections.find_by(source: source_url)

      return unless redirection&.destination.present?

      redirect_to redirection.destination, allow_other_host: true, status: :moved_permanently
    end
end
