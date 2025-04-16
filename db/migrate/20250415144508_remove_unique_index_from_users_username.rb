# frozen_string_literal: true

class RemoveUniqueIndexFromUsersUsername < ActiveRecord::Migration[7.1]
  def change
    remove_index :users, :username
  end
end
