# frozen_string_literal: true

class AddAssignedCategoryToQuizzes < ActiveRecord::Migration[7.1]
  def change
    add_column :quizzes, :assigned_category_id, :uuid
  end
end
