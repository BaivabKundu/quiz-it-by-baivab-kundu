# frozen_string_literal: true

json.redirections @redirections do |redirection|
  json.extract! redirection, :id, :source, :destination, :created_at, :updated_at, :organization_id
end
