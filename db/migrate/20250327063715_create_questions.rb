# frozen_string_literal: true

class CreateQuestions < ActiveRecord::Migration[7.1]
  def change
    create_table :questions, id: :uuid do |t|
      t.string :body, null: false
      t.uuid :quiz_id, null: false
      t.jsonb :options, default: [], null: false
      t.integer :answer_id, null: false

      t.timestamps
    end

    add_foreign_key :questions, :quizzes, column: :quiz_id
  end
end
