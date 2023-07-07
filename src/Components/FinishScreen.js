import { useQuiz } from '../Contexts/QuizContext'

function FinishScreen() {
  const { highscore, points, dispatch, summaryPoints } = useQuiz()
  const percentage = (points / summaryPoints) * 100

  let emoji

  if (percentage === 100) emoji = '🥇'
  if (percentage >= 80 && percentage < 100) emoji = '🎉'
  if (percentage >= 50 && percentage < 80) emoji = '😃'
  if (percentage >= 0 && percentage < 50) emoji = '😒'
  if (percentage === 0) emoji = '😲'
  return (
    <>
      <p className="result">
        <span>{emoji}</span>ored <strong>{points}</strong> out of
        {summaryPoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <button
        onClick={() => dispatch({ type: 'restart' })}
        className="btn btn-ui"
      >
        Restart Quiz
      </button>
    </>
  )
}

export default FinishScreen
