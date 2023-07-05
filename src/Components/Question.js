import Options from "./Options"

function Question({answer, dispatch, question }) {
  return (
    <div>
      <h4>{question.question}</h4>
		<Options answer={answer} dispatch={dispatch} question={question}/>
    </div>
  )
}

export default Question
