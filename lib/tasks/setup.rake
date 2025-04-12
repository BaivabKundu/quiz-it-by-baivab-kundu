# frozen_string_literal: true

desc "drops the db, creates db, migrates db and populates sample data"
task setup: [:environment, "db:drop", "db:create", "db:migrate"] do
  Rake::Task["reset_and_populate_sample_data"].invoke if Rails.env.development?
end

desc "Populates sample data without resetting the database first"
task populate_sample_data: [:environment] do
  create_sample_data!
  puts "sample data has been added."
end

desc "Populates sample data without after resetting the database"
task reset_and_populate_sample_data: [:environment] do
  if Rails.env.production?
    puts "Skipping deleting and populating sample data"
  elsif Rails.env.staging?
    puts "Skipping deleting and populating sample data"
  else
    delete_all_records_from_all_tables
    Rake::Task["populate_sample_data"].invoke
  end
end

#
# DO NOT CHANGE ANYTHING IN THIS METHOD
# This is last layer of defense against deleting data in production
# If you need to delete data in staging or in production
# please execute the command manually and do not change this method
#
def delete_all_records_from_all_tables
  if Rails.env.production?
    raise "deleting all records in production is not alllowed"
  else
    Rake::Task["db:schema:load"].invoke
  end
end

def create_sample_data!
  # Create organization
    puts "🏢 Creating organization..."
    organization = Organization.create!(name: "BigBinary Academy")

    # Create users
    puts "👤 Creating users..."
    admin = User.create!(username: "Oliver Smith", email: "oliver@example.com", password: "welcome1234", password_confirmation: "welcome1234", role: "admin", assigned_organization_id: organization.id)
    user1 = User.create!(username: "Luna Smith", email: "luna@example.com", password: "welcome1234", password_confirmation: "welcome1234", role: "standard", assigned_organization_id: organization.id)
    user2 = User.create!(username: "Sam Smith", email: "sam@example.com", password: "welcome1234", password_confirmation: "welcome1234", role: "standard", assigned_organization_id: organization.id)

    # Create categories
    puts "📚 Creating categories..."
    categories = 3.times.map do
      Category.create!(name: Faker::Educator.subject)
    end

    # Create quizzes and questions
    puts "📝 Creating quizzes and questions..."
    quizzes = []

    categories.each do |category|
      2.times do
        quiz = Quiz.create!(
          name: Faker::Educator.course_name,
          status: %w[published draft].sample,
          accessibility: ["discoverable", "hidden"].sample,
          assigned_category_id: category.id,
          assigned_organization_id: organization.id,
          creator_id: admin.id,
          questions_count: 0,
          submissions_count: 0
        )
        5.times do
          options = [
            { text: Faker::Lorem.word, is_correct: false },
            { text: Faker::Lorem.word, is_correct: false },
            { text: Faker::Lorem.word, is_correct: false },
            { text: Faker::Lorem.word, is_correct: true }
          ].shuffle
          Question.create!(
            quiz_id: quiz.id,
            body: Faker::Lorem.sentence,
            options: options,
            answer_id: options.index { |opt| opt[:is_correct] } + 1
          )
        end
        quizzes << quiz
      end
    end

    # Create submissions
    puts "📄 Creating submissions..."
    quizzes.sample(3).each do |quiz|
      [user1, user2].each do |user|
        Submission.create!(
          user: user,
          quiz: quiz,
          status: "completed",
          total_questions: quiz.questions_count,
          correct_answers_count: rand(0..quiz.questions_count),
          wrong_answers_count: rand(0..quiz.questions_count),
          unanswered_count: rand(0..quiz.questions_count),
          answers: quiz.questions.map do |question|
            {
              question_id: question.id,
              selected_option_index: rand(0..3)
            }
          end
        )
      end
    end

    puts "✅ Done seeding!"
end
