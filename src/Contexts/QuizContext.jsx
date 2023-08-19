import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'

const initialState = {
  questions: [
    {
      question: 'Which is the most popular JavaScript framework?',
      options: ['Angular', 'React', 'Svelte', 'Vue'],
      correctOption: 1,
      points: 10,
    },
    {
      question: 'Which company invented React?',
      options: ['Google', 'Apple', 'Netflix', 'Facebook'],
      correctOption: 3,
      points: 10,
    },
    {
      question: "What's the fundamental building block of React apps?",
      options: ['Components', 'Blocks', 'Elements', 'Effects'],
      correctOption: 0,
      points: 10,
    },
    {
      question:
        "What's the name of the syntax we use to describe the UI in React components?",
      options: ['FBJ', 'Babel', 'JSX', 'ES2015'],
      correctOption: 2,
      points: 10,
    },
    {
      question: 'How does data flow naturally in React apps?',
      options: [
        'From parents to children',
        'From children to parents',
        'Both ways',
        'The developers decides',
      ],
      correctOption: 0,
      points: 10,
    },
    {
      question: 'How to pass data into a child component?',
      options: ['State', 'Props', 'PropTypes', 'Parameters'],
      correctOption: 1,
      points: 10,
    },
    {
      question: 'When to use derived state?',
      options: [
        'Whenever the state should not trigger a re-render',
        'Whenever the state can be synchronized with an effect',
        'Whenever the state should be accessible to all components',
        'Whenever the state can be computed from another state variable',
      ],
      correctOption: 3,
      points: 30,
    },
    {
      question: 'What triggers a UI re-render in React?',
      options: [
        'Running an effect',
        'Passing props',
        'Updating state',
        'Adding event listeners to DOM elements',
      ],
      correctOption: 2,
      points: 20,
    },
    {
      question: 'When do we directly "touch" the DOM in React?',
      options: [
        'When we need to listen to an event',
        'When we need to change the UI',
        'When we need to add styles',
        'Almost never',
      ],
      correctOption: 3,
      points: 20,
    },
    {
      question: 'In what situation do we use a callback to update state?',
      options: [
        'When updating the state will be slow',
        'When the updated state is very data-intensive',
        'When the state update should happen faster',
        'When the new state depends on the previous state',
      ],
      correctOption: 3,
      points: 30,
    },
    {
      question:
        'If we pass a function to useState, when will that function be called?',
      options: [
        'On each re-render',
        'Each time we update the state',
        'Only on the initial render',
        'The first time we update the state',
      ],
      correctOption: 2,
      points: 30,
    },
    {
      question:
        "Which hook to use for an API request on the component's initial render?",
      options: ['useState', 'useEffect', 'useRef', 'useReducer'],
      correctOption: 1,
      points: 10,
    },
    {
      question:
        'Which variables should go into the useEffect dependency array?',
      options: [
        'Usually none',
        'All our state variables',
        'All state and props referenced in the effect',
        'All variables needed for clean up',
      ],
      correctOption: 2,
      points: 30,
    },
    {
      question: 'An effect will always run on the initial render.',
      options: [
        'True',
        'It depends on the dependency array',
        'False',
        'In depends on the code in the effect',
      ],
      correctOption: 0,
      points: 30,
    },
    {
      question:
        "When will an effect run if it doesn't have a dependency array?",
      options: [
        'Only when the component mounts',
        'Only when the component unmounts',
        'The first time the component re-renders',
        'Each time the component is re-rendered',
      ],
      correctOption: 3,
      points: 20,
    },
  ],
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

//g
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
        summaryPoints,
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
