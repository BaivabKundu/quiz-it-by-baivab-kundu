# frozen_string_literal: true

class AddAssignedOrganizationToQuizzes < ActiveRecord::Migration[7.1]
  def change
    add_column :quizzes, :assigned_organization_id, :uuid

    reversible do |dir|
      dir.up do
        first_org = Organization.first
        if first_org
          Quiz.update_all(assigned_organization_id: first_org.id)
        end
      end
    end
  end
end
