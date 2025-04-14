# frozen_string_literal: true

json.organization do
  json.partial! 'api/v1/organizations/organization', organization: @organization
end
