# frozen_string_literal: true

class EvaluationService
  def initialize(params, submission = nil)
    @params = params
    @submission = submission
  end

  def process!
    if !@submission.nil?
      update_submission
    else
      build_submission
    end
    evaluate_answers
    @submission.save!
    @submission
  end

  private

    def build_submission
      @quiz = Quiz.find_by!(slug: @params[:slug])
      user = User.find(@params[:user_id])
      @questions = @quiz.questions
      @submission = Submission.new(user:, quiz: @quiz)
      @submission.answers = submission_params[:answers]
      @submission.status = submission_params[:status]
    end

    def update_submission
      @quiz = Quiz.find_by!(slug: @params[:slug])
      @questions = @quiz.questions
      @submission.answers = submission_params[:answers]
      @submission.status = submission_params[:status]
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

        if selected_choice == correct_answer
          correct_answers_count += 1
        else
          wrong_answers_count += 1
        end
      end

      total_questions = @questions.count
      @submission.total_questions = total_questions
      @submission.correct_answers_count = correct_answers_count
      @submission.wrong_answers_count = wrong_answers_count
      @submission.unanswered_count = total_questions - correct_answers_count - wrong_answers_count
    end

    def submission_params
      @params.require(:submission).permit(:status, answers: [:question_id, :selected_option_index])
    end
end
