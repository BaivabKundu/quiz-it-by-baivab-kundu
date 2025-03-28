# frozen_string_literal: true

class CreateQuizzes < ActiveRecord::Migration[7.1]
  def change
    create_table :quizzes, id: :uuid do |t|
      t.string :name, null: false
      t.integer :questions_count, default: 0, null: false
      t.integer :submissions_count, default: 0, null: false

      t.timestamps
    end
  end
end
