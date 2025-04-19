# frozen_string_literal: true

class Redirection < ApplicationRecord
  belongs_to :organization

  validates :source, presence: true, uniqueness: true
  validates :destination, presence: true

  validate :source_and_destination_differ
  validate :prevent_cyclic_redirection

  private

    def source_and_destination_differ
      return if source.blank? || destination.blank?

      errors.add(:destination, "must be different from source") if source == destination
    end

    def prevent_cyclic_redirection
      return if source.blank? || destination.blank?

      current_destination = destination
      while (redirection = Redirection.find_by(source: current_destination))
        if redirection.destination == source
          errors.add(:destination, "would create a cyclic redirection")
          break
        end
        current_destination = redirection.destination
      end
    end
end
