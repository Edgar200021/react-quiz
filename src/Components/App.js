import { useEffect, useMemo, useReducer } from 'react'
import Header from './Header'
import Loader from './Loader'
import Error from './Error'
import Main from './Main'
import StartScreen from './StartScreen'
import Question from './Question'
import NextButton from './NextButton'
import Progress from './Progress'
import FinishScreen from './FinishScreen'
import Footer from './Footer'
import Timer from './Timer'

const SECS_PER_QUESTION = 30

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' }
    case 'dataFailed':
      return { ...state, status: 'error' }
    case 'start':
      return { ...state, status: 'active', secondsRemaining: state.questions.length * SECS_PER_QUESTION }
    case 'newAnswer':
      const question = state.questions.at(state.index)

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      }
    case 'nextQuestion':
      return { ...state, answer: null, index: state.index + 1 }
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      }
    case 'restart':
      return {
        ...initialState,
        questions: state.questions,
        highscore: state.highscore,
        status: 'ready',
      }
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 1 ? 'finished' : state.status,
      }
    default:
      throw new Error('Action unknown')
  }
}

const App = () => {
  const [
    { secondsRemaining, highscore, questions, points, status, index, answer },
    dispatch,
  ] = useReducer(reducer, initialState)

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch('http://localhost:4000/questions')

        if (!res.ok) {
          dispatch({ type: 'start' })
          return
        }
        const data = await res.json()

        dispatch({ type: 'dataReceived', payload: data })
      } catch {
        dispatch({ type: 'dataFailed' })
      }
    }

    getData()
  }, [])

  const summaryPoints = useMemo(
    () => questions.reduce((acc, { points }) => acc + points, 0),
    [questions]
  )

  const content =
    status === 'loading' ? (
      <Loader />
    ) : status === 'error' ? (
      <Error />
    ) : status === 'ready' ? (
      <StartScreen dispatch={dispatch} numQuestions={questions.length} />
    ) : status === 'active' ? (
      <>
        <Progress
          summaryPoints={summaryPoints}
          points={points}
          index={index}
          numQuestion={questions.length}
          answer={answer}
        />
        <Question
          answer={answer}
          dispatch={dispatch}
          question={questions[index]}
        />
        <Footer>
          <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
          <NextButton
            index={index}
            numQuestions={questions.length}
            answer={answer}
            dispatch={dispatch}
          />
        </Footer>
      </>
    ) : status === 'finished' ? (
      <FinishScreen
        highscore={highscore}
        points={points}
        maxPossiblePoints={summaryPoints}
        dispatch={dispatch}
      />
    ) : null

  return (
    <div className="app">
      <Header />
      <Main>{content}</Main>
    </div>
  )
}

export default App
