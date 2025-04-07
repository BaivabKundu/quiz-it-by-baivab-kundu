# frozen_string_literal: true

module ApplicationHelper
  def date_from_timestamp(timestamp, timezone)
    parsed_timestamp(timestamp).in_time_zone(timezone).strftime("%d %B %Y")
  end

  def time_from_timestamp(timestamp, timezone)
    parsed_timestamp(timestamp).in_time_zone(timezone).strftime("%I:%M %p")
  end

  def date_and_time_from_timestamp(timestamp, timezone)
    [
      date_from_timestamp(timestamp, timezone),
      time_from_timestamp(timestamp, timezone)
    ].join(", ").strip
  end

  private

    def parsed_timestamp(timestamp)
      timestamp.is_a?(String) ? DateTime.parse(timestamp) : timestamp
    end
end
