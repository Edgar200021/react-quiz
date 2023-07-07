import { useQuiz } from '../Contexts/QuizContext'

function NextButton() {
  const { dispatch, answer, index, questions } = useQuiz()

  if (answer === null) return null

  if (index < questions.length - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'nextQuestion' })}
      >
        Next Question
      </button>
    )

  return (
    <button className="btn btn-ui" onClick={() => dispatch({ type: 'finish' })}>
      Finish
    </button>
  )
}

export default NextButton
