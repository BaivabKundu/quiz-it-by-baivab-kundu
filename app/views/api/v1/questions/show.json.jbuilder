json.quiz do
  json.extract! @current_quiz,
    :name,
    :slug

  json.question do
    json.extract! @question,
      :id,
      :body,
      :answer_id
    json.options @question.options["entries"] || []
  end
end
