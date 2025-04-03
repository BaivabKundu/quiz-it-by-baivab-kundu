# frozen_string_literal: true

class AddAssignedQuizToSubmissions < ActiveRecord::Migration[7.1]
  def change
    add_column :submissions, :assigned_quiz_id, :uuid
  end
end
