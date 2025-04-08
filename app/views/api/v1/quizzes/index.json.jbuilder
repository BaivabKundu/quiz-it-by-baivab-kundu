# frozen_string_literal: true

json.quizzes @quizzes do |quiz|
  json.extract! quiz, :id, :name, :slug, :status, :accessibility, :assigned_category_id, :assigned_organization_id, :submissions_count, :creator_id, :created_at, :updated_at

  json.category quiz.category.name
end

json.meta @meta
