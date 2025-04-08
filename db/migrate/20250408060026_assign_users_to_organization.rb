# frozen_string_literal: true

class AssignUsersToOrganization < ActiveRecord::Migration[7.1]
  def up
    organization = Organization.first

    if organization
      User.update_all(assigned_organization_id: organization.id)
    else
      raise "Organizations not found. Please create it first."
    end
  end

  def down
    User.update_all(assigned_organization_id: nil)
  end
end
