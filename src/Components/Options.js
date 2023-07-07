import { useQuiz } from '../Contexts/QuizContext'

function Options({ question }) {
  const { dispatch, answer } = useQuiz()

  function handleAnswer(answer) {
    dispatch({ type: 'newAnswer', payload: answer })
  }

  const hasAnswered = answer !== null

  return (
    <div className="options">
      {question.options.map((option, index) => {
        return (
          <button
            onClick={() => handleAnswer(index)}
            key={option}
            className={`btn btn-option ${index === answer ? 'answer' : null} ${
              hasAnswered
                ? index === question.correctOption
                  ? 'correct'
                  : 'wrong'
                : ''
            }
			
			`}
            disabled={hasAnswered}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

export default Options
