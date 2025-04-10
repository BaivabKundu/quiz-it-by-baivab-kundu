# frozen_string_literal: true

class AddAnswersToSubmissions < ActiveRecord::Migration[7.1]
  def change
    add_column :submissions, :answers, :jsonb, default: [], null: false
  end
end
