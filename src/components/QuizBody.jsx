import React, { useState, useRef, useEffect } from 'react';
import { piDigitsArray } from '../data';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function QuizBody({start, end, disabled, reset, onWin, onEncourage}) {
    const newPiDigitsArray = piDigitsArray.slice(start-1, end);
    const [userAnswers, setUserAnswers] = useState(Array(newPiDigitsArray.length).fill(''));
    const [correct, setCorrect] = useState(Array(newPiDigitsArray.length).fill(false));
    const inputRefs = useRef([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lastEncourage, setLastEncourage] = useState(0);

    const {transcript, listening, resetTranscript, browserSupportsSpeechRecognition} = useSpeechRecognition();
    useEffect(() => {
        setUserAnswers(Array(newPiDigitsArray.length).fill(''));
        setCorrect(Array(newPiDigitsArray.length).fill(false));
        setCurrentIndex(0);
        resetTranscript();
      }, [reset, start, end, newPiDigitsArray.length, resetTranscript]);

    useEffect(() => {
        if (!disabled && inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, [disabled, start, end]);

    useEffect(() => {
    if (
        correct.length > 0 &&
        correct.every(Boolean) &&
        typeof onWin === 'function'
    ) {
        onWin();
    }
    
    if (typeof onEncourage === 'function' && correct.length > 0) {
        const total = correct.length;
        const numCorrect = correct.filter(Boolean).length;
        const percent = Math.floor((numCorrect / total) * 100);
        if (
          percent > 0 &&
          percent < 100 &&
          percent % 10 === 0 &&
          percent !== lastEncourage
        ) {
          setLastEncourage(percent);
          onEncourage(percent);
        }
      }
    }, [correct, onWin, onEncourage, lastEncourage]);

    useEffect(() => {
      setLastEncourage(0);
    }, [reset, start, end]);

      const handleChange = (idx, value) => {
        if (disabled) return;
        value = value.slice(-1);
        if (!/^\d$/.test(value)) return;
    
        if (value === newPiDigitsArray[idx]) {
          const newInputs = [...userAnswers];
          const newCorrect = [...correct];
          newInputs[idx] = value;
          newCorrect[idx] = true;
          setUserAnswers(newInputs);
          setCorrect(newCorrect);
    
          if (inputRefs.current[idx + 1]) {
            inputRefs.current[idx + 1].focus();
            setCurrentIndex(idx + 1);
          }
        }
      };

      useEffect(() => {
          if (disabled) return;
          const digits = transcript.replace(/\D/g, '').split('');
          if (digits.length && currentIndex < newPiDigitsArray.length) {
            let idx = currentIndex;
            let newInputs = [...userAnswers];
            let newCorrect = [...correct];
            for (let d of digits) {
              if (idx >= newPiDigitsArray.length) break;
              if (d === newPiDigitsArray[idx]) {
                newInputs[idx] = d;
                newCorrect[idx] = true;
                idx++;
              } else {
                break; // Stop on first incorrect
              }
            }
            setUserAnswers(newInputs);
            setCorrect(newCorrect);
            setCurrentIndex(idx);
            if (inputRefs.current[idx]) inputRefs.current[idx].focus();
            resetTranscript();
          }
      }, [disabled, transcript, currentIndex, newPiDigitsArray, userAnswers, correct, inputRefs, resetTranscript])
      return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
            {newPiDigitsArray.map((digit, idx) => (
              <input
                key={idx}
                ref={el => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={userAnswers[idx]}
                disabled={disabled || correct[idx]}
                onChange={e => handleChange(idx, e.target.value)}
                style={{
                  width: '32px',
                  textAlign: 'center',
                  margin: '5px',
                  backgroundColor: correct[idx] ? '#b6fcb6' : undefined,
                  border: '1px solid #ccc',
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                }}
                autoComplete="off"
                inputMode="numeric"
              />
            ))}
          </div>

      );
}

export default QuizBody;