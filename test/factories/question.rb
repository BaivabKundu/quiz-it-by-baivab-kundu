# frozen_string_literal: true

FactoryBot.define do
  factory :question do
    body { Faker::Lorem.unique.sentence }
    options do
      [
        { text: Faker::Lorem.unique.word, is_correct: false },
        { text: Faker::Lorem.unique.word, is_correct: false },
        { text: Faker::Lorem.unique.word, is_correct: false },
        { text: Faker::Lorem.unique.word, is_correct: true }
      ].shuffle
    end
    answer_id { options.index { |opt| opt[:is_correct] } }
    quiz { association :quiz }
  end
end
