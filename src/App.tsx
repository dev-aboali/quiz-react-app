
import React, { useState } from 'react';
import QuestionCard from './components/QuestionCard';
import { fetchQuizQuestions, Difficulty, QuestionState } from './API';
import { GlobalStyle, Container } from './App.styles'

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}
const TOTAL_QUESTIONS = 10;

const App = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true)
  
  const startTrivia = async () => {
    setLoading(true)
    setGameOver(false)
    setScore(0)
    setUserAnswers([])
    setNumber(0)

    const newQuestion = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY)
    setQuestions(newQuestion)
    setLoading(false)
  }


  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver) {
      const answer = e.currentTarget.value
      
      const correct = questions[number].correct_answer === answer
      if(correct) setScore(score => score + 1)

      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }
      setUserAnswers(userAnswers => [...userAnswers, answerObject])
    }
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if(nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    }else {
      setNumber(nextQuestion)
    }

  }


  return (
    <>
    <GlobalStyle />
    <div className="App">
      <Container>
      <h1>React Quiz</h1>
      {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
        <button onClick={startTrivia} className="start">Start</button>
      ): null}
      { !gameOver && ( <div className="score">Score: { score }</div>) }
      { loading && (
        <p>Loading Questions ...</p>
      )}
      
      {
        !loading && !gameOver && (
          <QuestionCard 
            questionNr={number + 1}
            totalQuestions= {TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number]: null }
            callback={checkAnswer}
          />
        )
      }
      {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 && (
          <button className="next" onClick={nextQuestion}>
            Next Question
          </button>
      )
      }
      
      
      </Container>
    </div>
    </>
  );
}

export default App;


