json.extract! @quiz, :id, :name, :slug, :status, :accessibility, :submissions_count, :assigned_category_id, :creator_id, :created_at, :updated_at
json.category do
  json.extract! @quiz.category, :id, :name if @quiz.category
end
