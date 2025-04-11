# frozen_string_literal: true

FactoryBot.define do
  factory :quiz do
    name { Faker::Lorem.unique.sentence(word_count: 3) }
    status { "published" }
    accessibility { "discoverable" }
    creator { association :user }
    category { association :category }
    organization { association :organization }

    trait :draft do
      status { "draft" }
    end

    trait :hidden do
      accessibility { "hidden" }
    end
  end
end
