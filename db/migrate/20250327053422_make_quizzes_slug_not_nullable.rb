# frozen_string_literal: true

class MakeQuizzesSlugNotNullable < ActiveRecord::Migration[7.1]
  def change
    change_column_null :quizzes, :slug, false
  end
end
