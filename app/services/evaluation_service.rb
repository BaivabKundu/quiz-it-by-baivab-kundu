# frozen_string_literal: true

class EvaluationService
  def initialize(params, submission = nil, current_organization = nil)
    @params = params
    @submission = submission
    @current_organization = current_organization
  end

  def process!
    @quiz = @current_organization.quizzes.find_by!(slug: @params[:slug])
    if @submission.nil?
      build_submission
    else
      update_submission
    end
    @submission.answers = @params[:answers]
    @submission.status = @params[:status]
    evaluate_answers
    @submission.save!
    @submission
  end

  private

    def build_submission
      user = @current_organization.users.find(@params[:user_id])
      @questions = @quiz.questions
      @submission = Submission.new(user:, quiz: @quiz)
    end

    def update_submission
      @questions = @quiz.questions
    end

    def generate_answer_key
      answer_key = {}
      @questions.each do |question|
        answer_key[question.id] = question.answer_id - 1
      end
      answer_key
    end

    def evaluate_answers
      correct_answers_count = 0
      wrong_answers_count = 0

      answer_key = generate_answer_key

      @submission.answers.each do |answer|
        question_id = answer["question_id"]
        selected_choice = answer["selected_option_index"]
        correct_answer = answer_key[question_id]

        if selected_choice.nil?
          next
        elsif selected_choice == correct_answer
          correct_answers_count += 1
        else
          wrong_answers_count += 1
        end
      end

      @submission.total_questions = @questions.count
      @submission.correct_answers_count = correct_answers_count
      @submission.wrong_answers_count = wrong_answers_count
      @submission.unanswered_count = @questions.count - correct_answers_count - wrong_answers_count
    end
end
