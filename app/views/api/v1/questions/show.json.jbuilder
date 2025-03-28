json.quiz do
  json.extract! @current_quiz,
    :name,
    :slug

  json.question do
    json.extract! @question,
      :body,
      :answer_id
    json.options @question.options["entries"] || []
  end
end
