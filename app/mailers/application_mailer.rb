# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: "no-reply@quizit.com"
  layout "mailer"
end
