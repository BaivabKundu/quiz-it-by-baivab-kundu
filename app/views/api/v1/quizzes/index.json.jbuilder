json.quizzes @quizzes do |quiz|
  json.extract! quiz, :id, :name, :slug, :status, :accessibility, :assigned_category_id, :submissions_count, :creator_id, :created_at, :updated_at

  json.assigned_category do
    json.extract! quiz.assigned_category, :id, :name if quiz.assigned_category
  end
end
