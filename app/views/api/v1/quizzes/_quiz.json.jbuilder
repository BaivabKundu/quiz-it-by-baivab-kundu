# frozen_string_literal: true

json.extract! quiz, :id, :name, :slug, :status, :accessibility, :category_id, :organization_id, :time_limit,
  :randomize_choices, :randomize_questions, :submissions_count, :email_notifications, :questions_count, :creator_id, :created_at, :updated_at # rubocop:disable Layout/LineLength
