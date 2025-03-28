# frozen_string_literal: true

class AddAssignedUserToQuizzes < ActiveRecord::Migration[7.1]
  def change
    add_column :quizzes, :creator_id, :uuid
  end
end
