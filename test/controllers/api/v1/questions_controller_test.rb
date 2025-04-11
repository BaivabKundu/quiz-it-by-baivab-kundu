# frozen_string_literal: true

require "test_helper"

class Api::V1::QuestionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @quiz = create(:quiz)
    @question = create(:question, quiz: @quiz)

    correct_option_id = if @question.options.is_a?(Array)
      correct = @question.options.find { |opt| opt[:is_correct] }
      correct ? @question.options.index(correct) : nil
    else
      @question.options.find_by(is_correct: true)&.id
    end

    @question_params = {
      question: {
        body: "What is 2 + 2?",
        answer_id: correct_option_id,
        options: [
          { text: "3", is_correct: false },
          { text: "4", is_correct: true }
        ]
      }
    }
  end

  def test_index_returns_questions
    get api_v1_questions_url, params: { quiz_slug: @quiz.slug }, as: :json
    assert_response :success
    assert_equal @quiz.questions.count, JSON.parse(response.body)["questions"].count
  end

  def test_show_returns_question
    get api_v1_question_url(@question), params: { quiz_slug: @quiz.slug }, as: :json

    assert_response :success
    response_data = JSON.parse(response.body)

    question_data = response_data.dig("quiz", "question")
    assert_not_nil question_data, "Expected 'quiz.question' to be present in the response"

    assert_equal @question.body, question_data["body"]
end

  def test_create_creates_new_question
    options = [
      { text: "Option 1", is_correct: false },
      { text: "Option 2", is_correct: false },
      { text: "Option 3", is_correct: true },
      { text: "Option 4", is_correct: false }
    ]

    correct_index = options.index { |opt| opt[:is_correct] }

    question_payload = {
      body: "What is the correct answer?",
      options: options,
      answer_id: correct_index
    }

    assert_difference("Question.count", 1) do
      post api_v1_questions_url,
        params: {
          question: question_payload,
          quiz_slug: @quiz.slug
        },
        as: :json
      puts "Response: #{response.body}"
    end

    assert_response :success
    assert_equal "Question was successfully created!", JSON.parse(response.body)["notice"]
  end

  def test_create_returns_error_for_invalid_params
    invalid_params = { question: { body: "", quiz_id: @quiz.id }, quiz_slug: @quiz.slug }
    assert_no_difference("Question.count") do
      post api_v1_questions_url, params: invalid_params, as: :json
    end
    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body)["error"], "Body can't be blank"
  end

  def test_update_updates_question
    updated_params = @question_params.deep_dup

    updated_params[:question][:answer_id] =
      updated_params[:question][:options].find_index { |opt| opt[:is_correct] }

    patch api_v1_question_url(@question),
      params: updated_params.merge(quiz_slug: @quiz.slug),
      as: :json

    assert_response :success
    assert_equal "Question was successfully updated!", JSON.parse(response.body)["notice"]
    assert_equal "What is 2 + 2?", @question.reload.body
  end

  def test_update_returns_error_for_invalid_params
    invalid_params = { question: { body: "" }, quiz_slug: @quiz.slug }
    patch api_v1_question_url(@question), params: invalid_params, as: :json
    assert_response :unprocessable_entity
    assert_includes JSON.parse(response.body)["error"], "Body can't be blank"
  end

  def test_destroy_deletes_question
    assert_difference("Question.count", -1) do
      delete api_v1_question_url(@question), params: { quiz_slug: @quiz.slug }, as: :json
    end
    assert_response :success
    assert_equal "Question was successfully deleted!", JSON.parse(response.body)["notice"]
  end
end
