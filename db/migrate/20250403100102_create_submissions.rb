# frozen_string_literal: true

class CreateSubmissions < ActiveRecord::Migration[7.1]
  def change
    create_table :submissions, id: :uuid do |t|
      t.integer :total_questions, null: false, default: 0
      t.integer :correct_answers_count, null: false, default: 0
      t.integer :wrong_answers_count, null: false, default: 0
      t.integer :unanswered_count, null: false, default: 0

      t.timestamps
    end
  end
end
