# frozen_string_literal: true

class ResultService
  def initialize(params, current_organization)
    @params = params
    @current_organization = current_organization
  end

  def process!
    @submission = fetch_submission
    @questions = @quiz.questions
    EmailJob.perform_async(@submission.id) if @quiz.email_notifications
    [@submission, @questions]
  end

  private

    def fetch_submission
      @quiz = @current_organization.quizzes.find_by!(slug: @params[:slug])
      @quiz.submissions.find(@params[:submission_id])
    end
end
