# frozen_string_literal: true

class AddAssignedOrganizationToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :organization_id, :uuid
  end
end
