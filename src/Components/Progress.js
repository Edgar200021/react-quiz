import { useQuiz } from '../Contexts/QuizContext'

function Progress() {
  const { points, answer, index, questions, summaryPoints } = useQuiz()

  return (
    <header className="progress">
      <progress
        max={questions.length}
        value={index + Number(answer !== null)}
      />
      <p>
        Question <strong>{index + 1}</strong>/{questions.length}
      </p>
      <p>
        <strong>{points}</strong>/{summaryPoints}
      </p>
    </header>
  )
}

export default Progress
