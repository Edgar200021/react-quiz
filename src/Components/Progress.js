function Progress({ points, summaryPoints, answer, index, numQuestion }) {
  return (
    <header className="progress">
	<progress max={numQuestion} value={index + Number(answer !== null)}/>
      <p>
        Question <strong>{index + 1}</strong>/{numQuestion}
      </p>
      <p>
        <strong>{points}</strong>/{summaryPoints}
      </p>
    </header>
  )
}

export default Progress
