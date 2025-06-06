import React, { useState, useRef, useEffect } from 'react';
import { piDigitsArray } from '../piDigits';

function QuizBody({start, end, disabled, reset, onWin}){
    const newPiDigitsArray = piDigitsArray.slice(start-1, end);
    const [userAnswers, setUserAnswers] = useState(Array(newPiDigitsArray.length).fill(''));
    const [correct, setCorrect] = useState(Array(newPiDigitsArray.length).fill(false));
    const inputRefs = useRef([]);

    useEffect(() => {
        setUserAnswers(Array(newPiDigitsArray.length).fill(''));
        setCorrect(Array(newPiDigitsArray.length).fill(false));
      }, [reset, start, end, newPiDigitsArray.length]);

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
    }, [correct, onWin]);
    
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
          }
        }
      };

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