export const handleSubmit =
  (isEditMode, updateQuestion, createQuestion, questionId, slug, history) =>
  values => {
    if (isEditMode) {
      updateQuestion(
        {
          questionId,
          slug,
          payload: {
            body: values.question,
            options: values.options.map(option => ({
              text: option.text,
              isCorrect: option.isCorrect,
            })),
          },
        },
        {
          onSuccess: () => history.push(`/admin/quizzes/${slug}/questions`),
        }
      );
    } else {
      createQuestion(
        {
          body: values.question,
          options: values.options.map(option => ({
            text: option.text,
            isCorrect: option.isCorrect,
          })),
          answerId: values.options.find(option => option.isCorrect)?.id,
        },
        {
          onSuccess: () => {
            history.push(`/admin/quizzes/${slug}/questions`);
          },
        }
      );
    }
  };

export const handleSubmitAndAddNew =
  (createQuestion, setQuestion, setOptions, setQuestionNumber) => values => {
    createQuestion(
      {
        body: values.question,
        options: values.options.map(option => ({
          text: option.text,
          isCorrect: option.isCorrect,
        })),
        answerId: values.options.find(option => option.isCorrect)?.id,
      },
      {
        onSuccess: () => {
          setQuestion("");
          setOptions([
            { id: 1, text: "", isCorrect: false },
            { id: 2, text: "", isCorrect: false },
            { id: 3, text: "", isCorrect: false },
            { id: 4, text: "", isCorrect: false },
          ]);

          setQuestionNumber(prev => String(Number(prev) + 1).padStart(2, "0"));
        },
      }
    );
  };

export const handleOptionChange = (options, setOptions) => (id, text) => {
  setOptions(
    options.map(option => (option.id === id ? { ...option, text } : option))
  );
};

export const handleCorrectAnswerChange = (options, setOptions) => id => {
  setOptions(
    options.map(option => ({ ...option, isCorrect: option.id === id }))
  );
};

export const handleAddOption = (options, setOptions) => () => {
  if (options.length < 6) {
    const newId = Math.max(...options.map(opt => opt.id)) + 1;
    setOptions([...options, { id: newId, text: "", isCorrect: false }]);
  }
};

export const handleRemoveOption = (options, setOptions) => id => {
  if (options.length > 2) {
    const newOptions = options.filter(opt => opt.id !== id);
    if (
      options.find(opt => opt.id === id)?.isCorrect &&
      newOptions.length > 0
    ) {
      newOptions[0].isCorrect = true;
    }
    setOptions(newOptions);
  }
};
