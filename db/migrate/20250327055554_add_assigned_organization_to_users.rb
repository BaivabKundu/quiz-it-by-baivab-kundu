# frozen_string_literal: true

class AddAssignedOrganizationToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :assigned_organization_id, :uuid
  end
end
