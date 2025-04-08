# frozen_string_literal: true

json.organizations @organizations do |organization|
  json.extract! organization, :id, :name
end
