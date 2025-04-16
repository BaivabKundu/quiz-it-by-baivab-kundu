# frozen_string_literal: true

class AddAssignedUserToSubmissions < ActiveRecord::Migration[7.1]
  def change
    add_column :submissions, :attempter_id, :uuid
  end
end
