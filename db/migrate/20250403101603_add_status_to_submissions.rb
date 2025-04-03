# frozen_string_literal: true

class AddStatusToSubmissions < ActiveRecord::Migration[7.1]
  def change
    add_column :submissions, :status, :string, default: "incomplete", null: false
  end
end
