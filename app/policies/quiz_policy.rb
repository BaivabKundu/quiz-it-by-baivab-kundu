# frozen_string_literal: true

class QuizPolicy
  attr_reader :user, :quiz

  def initialize(user, quiz)
    @user = user
    @quiz = quiz
  end

  def admin_and_creator?
    user.admin? && quiz.creator_id == user.id
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      scope.includes(:creator)
        .where(user_is_admin_and_creator_of_quiz)
    end

    private

      def user_is_admin_and_creator_of_quiz
        if user
          { creator_id: user.id, users: { role: :admin } }
        else
          { status: :published }
        end
      end
  end
end
