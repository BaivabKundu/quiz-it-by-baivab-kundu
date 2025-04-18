# frozen_string_literal: true

class EmailJob
  include Sidekiq::Job

  def perform(submission_id)
    ResultMailer.result_email(submission_id).deliver_now
  end
end
