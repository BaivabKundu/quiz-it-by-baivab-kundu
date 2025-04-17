# frozen_string_literal: true

class AddRandomizationColumnsToQuizzes < ActiveRecord::Migration[7.1]
  def change
    add_column :quizzes, :randomize_questions, :boolean, default: false
    add_column :quizzes, :randomize_choices, :boolean, default: false
  end
end
