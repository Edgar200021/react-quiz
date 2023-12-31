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
import { useQuiz } from '../Contexts/QuizContext'

const App = () => {
  const { status } = useQuiz()

  const content =
    status === 'loading' ? (
      <Loader />
    ) : status === 'error' ? (
      <Error />
    ) : status === 'ready' ? (
      <StartScreen />
    ) : status === 'active' ? (
      <>
        <Progress />
        <Question />
        <Footer>
          <Timer />
          <NextButton />
        </Footer>
      </>
    ) : status === 'finished' ? (
      <FinishScreen />
    ) : null

  return (
    <div className="app">
      <Header />
      <Main>{content}</Main>
    </div>
  )
}

export default App
