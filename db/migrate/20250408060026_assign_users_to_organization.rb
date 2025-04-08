# frozen_string_literal: true

class AssignUsersToOrganization < ActiveRecord::Migration[7.1]
  def up
    big_binary = Organization.find_by(name: "BigBinary Academy")

    if big_binary
      User.update_all(assigned_organization_id: big_binary.id)
    else
      raise "BigBinary Academy organization not found. Please create it first."
    end
  end

  def down
    User.update_all(assigned_organization_id: nil)
  end
end
