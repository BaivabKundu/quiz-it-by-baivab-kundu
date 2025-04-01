json.questions @questions do |question|
  json.extract! question, :id, :body, :quiz_id, :answer_id, :created_at, :updated_at
  json.options question.options
end
