# frozen_string_literal: true

class QuizCloneService
  def initialize(quiz)
    @quiz = quiz
  end

  def process!
    clone_quiz
  end

  private

    def clone_quiz
      cloned_quiz = @quiz.deep_clone include: :questions
      cloned_quiz.submissions_count = 0
      clone_count = Quiz.where("name LIKE ?", "Copy of #{@quiz.name}%").count
      cloned_quiz.name = clone_count > 0 ? "Copy of #{@quiz.name} (#{clone_count + 1})" : "Copy of #{@quiz.name}"
      cloned_quiz.slug = nil
      cloned_quiz.save!

      Quiz.reset_counters(cloned_quiz.id, :questions)

      cloned_quiz
    end
end
