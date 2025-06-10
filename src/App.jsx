import React, {useState, useRef, useEffect } from 'react'

import './App.css'
import Header from './components/Header'
import QuizBody from './components/QuizBody'
import confetti from 'canvas-confetti'
import { ENCOURAGEMENTS } from './data'

function App() {
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(500);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15*60);
  const [reset, setReset] = useState(0);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);
  const [encourageMsg, setEncourageMsg] = useState('');
  const timerRef = useRef(null);

   const handleEncourage = () => {
    const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
    setEncourageMsg(`${msg}`);
    setTimeout(() => setEncourageMsg(''), 1000);
  };
  useEffect(() => {
    if (quizStarted && !quizEnded) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setQuizEnded(true);
            setLose(true); 
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [quizStarted, quizEnded]);

  useEffect(()=> {
    if(win){
      confetti();
      const timeout = setTimeout(()=>{
        setWin(false);
        setQuizStarted(false);
        setQuizEnded(false);
        setTimeLeft(15*60);
        setReset(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [win])

   useEffect(() => {
    if (lose) {
      const timeout = setTimeout(() => {
        setLose(false);
        setQuizStarted(false);
        setQuizEnded(false);
        setTimeLeft(15*60);
        setReset(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [lose]);

  const handleStart = ()=> {
    setQuizStarted(true);
    setQuizEnded(false);
    setTimeLeft(15*60);
  }
  const handleEnd = ()=>{
    setQuizStarted(false);
    setQuizEnded(true);
    setTimeLeft(15*60);
    clearInterval(timerRef.current);
    setReset(prev => prev + 1);
  }

  const handleWin = () => {setWin(true);};
  

  return (
    <>
      <h1>Digits of Pi Quiz</h1>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1em'}}>
        <h3 style={{margin: 0}}>Practice memorizing any sequence of digits</h3>
        {encourageMsg && (
          <span style={{marginLeft: '1em', color: '#2e8b57', fontWeight: 'bold', fontSize: '1.5em'}}>
            {encourageMsg}
          </span>
        )}
      </div>
      {win && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '20vh',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontSize: '5em',
          fontWeight: 'bold'
        }}>
          🎉 You win! 🎉
        </div>
      )}
      {lose && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '20vh',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontSize: '5em',
          fontWeight: 'bold',
          color: 'red',
        }}>
          ❌ You lose! ❌
        </div>
      )}
      <Header
        start={start}
        end={end}
        setStart={quizStarted ? () => {} : setStart}
        setEnd={quizStarted ? () => {} : setEnd}
        disabled={quizStarted && !quizEnded}
        quizStarted={quizStarted}
        quizEnded={quizEnded}
        timeLeft={timeLeft}
        onStart={handleStart}
        onEnd={handleEnd}
      />
      <QuizBody 
      start={start} 
      end={end} 
      disabled={!quizStarted || quizEnded} 
      reset={reset}
      onWin={handleWin}
      onEncourage={handleEncourage}
      />
    </>
  )
}

export default App
