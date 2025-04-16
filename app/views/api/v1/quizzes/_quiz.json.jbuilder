# frozen_string_literal: true

json.extract! quiz, :id, :name, :slug, :status, :accessibility, :category_id, :organization_id,
  :submissions_count, :questions_count, :creator_id, :created_at, :updated_at
