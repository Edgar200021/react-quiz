import { useReducer } from 'react'

const initalState = { count: 0, step: 1 }

function reducer(state, action) {
  switch (action.type) {
    case 'dec':
      return { ...state, count: state.count - state.step }
    case 'inc':
      return { ...state, count: state.count + state.step }
    case 'setCount':
      return { ...state, count: action.payload }
    case 'setStep':
      return { ...state, step: action.payload }
    case 'reset':
      return initalState
    default:
      throw new Error('Unknown action')
  }
}

function DateCounter() {
  const [state, dispatch] = useReducer(reducer, initalState)

  // This mutates the date object.
  const date = new Date('june 21 2027')
  date.setDate(date.getDate() + state.count)

  const dec = function () {
    dispatch({ type: 'dec' })
  }

  const inc = function () {
    dispatch({ type: 'inc' })
  }

  const defineCount = function (e) {
    //setCount(Number(e.target.value));
    dispatch({ type: 'setCount', payload: +e.target.value })
  }

  const defineStep = function (e) {
    //setStep(Number(e.target.value))
    dispatch({ type: 'setStep', payload: +e.target.value })
  }

  const reset = function () {
    dispatch({ type: 'reset' })
    //setCount(0);
    //setStep(1)
  }

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={state.step}
          onChange={defineStep}
        />
        <span>{state.step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={state.count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
export default DateCounter
