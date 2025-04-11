# frozen_string_literal: true

FactoryBot.define do
  factory :submission do
    status { "incomplete" }
    total_questions { 0 }
    correct_answers_count { 0 }
    wrong_answers_count { 0 }
    unanswered_count { 0 }
    answers { [] }
    user { association :user }
    quiz { association :quiz }

    trait :completed do
      status { "completed" }
    end
  end
end
