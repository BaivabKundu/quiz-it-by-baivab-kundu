json.extract! @quiz, :id, :name, :slug, :status, :accessibility, :submissions_count, :assigned_category_id, :creator_id, :created_at, :updated_at
json.assigned_category do
  json.extract! @quiz.assigned_category, :id, :name if @quiz.assigned_category
end
