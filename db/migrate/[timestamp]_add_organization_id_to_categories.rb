# frozen_string_literal: true

class AddOrganizationIdToCategories < ActiveRecord::Migration[7.0]
  def change
    add_reference :categories, :organization, null: false, foreign_key: true
  end
end
