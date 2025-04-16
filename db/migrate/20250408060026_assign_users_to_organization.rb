# frozen_string_literal: true

class AssignUsersToOrganization < ActiveRecord::Migration[7.1]
  def up
    organization = Organization.first_or_create!(
      name: "BigBinary Academy",
      created_at: Time.current,
      updated_at: Time.current
    )

    User.update_all(organization_id: organization.id)
  end

  def down
    User.update_all(organization_id: nil)
  end
end
