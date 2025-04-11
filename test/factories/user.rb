# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    username { Faker::Internet.unique.username }
    email { Faker::Internet.unique.email }
    password { "welcome123" }
    password_confirmation { "welcome123" }
    assigned_organization { association :organization }
    authentication_token { SecureRandom.hex(10) }

    trait :admin do
      role { "admin" }
    end
  end
end
