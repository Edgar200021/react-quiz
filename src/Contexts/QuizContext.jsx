import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
}

const SECS_PER_QUESTION = 30

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' }
    case 'dataFailed':
      return { ...state, status: 'error' }
    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      }
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

const QuizContext = createContext(null)

function QuizProvider({ children }) {
  const [
    { secondsRemaining, highscore, questions, points, status, index, answer },
    dispatch,
  ] = useReducer(reducer, initialState)

  const summaryPoints = useMemo(
    () => questions.reduce((acc, { points }) => acc + points, 0),
    [questions]
  )

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

  return (
    <QuizContext.Provider
      value={{
        secondsRemaining,
        highscore,
        questions,
        points,
        status,
        index,
        answer,
        dispatch,
		summaryPoints
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

function useQuiz() {
  const context = useContext(QuizContext)
  if (context === undefined) throw new Error('Error')
  return context
}

export { QuizProvider, useQuiz }
