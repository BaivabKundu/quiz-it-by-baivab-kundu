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

  def public_and_admin?
    user.nil? || (user.admin? ? admin_and_creator? : true)
  end

  def index?
    true
  end

  def show?
    public_and_admin?
  end

  def create?
    user.admin?
  end

  def update?
    admin_and_creator?
  end

  def destroy?
    admin_and_creator?
  end

  def bulk_update?
    create?
  end

  def bulk_destroy?
    create?
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
