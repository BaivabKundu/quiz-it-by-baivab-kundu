# frozen_string_literal: true

class AddStatusAndAccessibilityToQuizzes < ActiveRecord::Migration[7.1]
  def change
    add_column :quizzes, :accessibility, :string, default: "discoverable", null: false
    add_column :quizzes, :status, :string, default: "published", null: false
  end
end
