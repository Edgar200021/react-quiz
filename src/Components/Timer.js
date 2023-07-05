import { useEffect } from 'react'

function Timer({ secondsRemaining, dispatch }) {
  const minutes = String(Math.floor(secondsRemaining / 60)).padStart(2, 0),
    seconds = String(secondsRemaining % 60).padStart(2, 0)

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'tick' })
    }, 1000)

    return () => clearInterval(interval)
  }, [dispatch])

  return (
    <div className="timer">
      {minutes}:{seconds}
    </div>
  )
}

export default Timer
