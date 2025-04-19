# frozen_string_literal: true

class CreateRedirections < ActiveRecord::Migration[7.1]
  def change
    create_table :redirections, id: :uuid do |t|
      t.string :source, null: false
      t.string :destination, null: false
      t.timestamps
    end
  end
end
