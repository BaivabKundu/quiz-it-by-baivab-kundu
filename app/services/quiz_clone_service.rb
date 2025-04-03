# frozen_string_literal: true

class QuizCloneService
  def initialize(quiz)
    @quiz = quiz
  end

  def process!
    clone
  end

  private

    def clone
      cloned_quiz = @quiz.deep_clone include: :questions
      cloned_quiz.submissions_count = 0
      cloned_quiz.name = "Copy of #{@quiz.name}"
      cloned_quiz.slug = nil
      cloned_quiz.save!
      cloned_quiz
    end
end
