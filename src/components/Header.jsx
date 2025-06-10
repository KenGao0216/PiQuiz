import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function Header({
  start,
  end,
  setStart,
  setEnd,
  disabled,
  quizStarted,
  quizEnded,
  timeLeft,
  onStart,
  onEnd
}) {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const {listening, browserSupportsSpeechRecognition} = useSpeechRecognition();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div>
          <label>Start Digit</label> <br />
          <input
            type="number"
            value={start}
            min={1}
            max={2000}
            onChange={e => setStart(Number(e.target.value))}
            style={{ marginRight: '10px' }}
            disabled={disabled}
          />
        </div>
        <div>
          <label>End Digit</label> <br />
          <input
            type="number"
            value={end}
            min={1}
            max={2000}
            onChange={e => setEnd(Number(e.target.value))}
            disabled={disabled}
          />
        </div>
      </div>
      <div style={{ 
        marginTop: '1em',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        }}>
          <div style={{ marginLeft: '2em' }}>
            <button
            onClick={onStart}
            disabled={quizStarted && !quizEnded}
            style={{
                color: 'black',
                borderColor: 'black',
                backgroundColor: 'green',
                marginRight: '10px'
            }}
            >
            Start
            </button>
            <button
            onClick={onEnd}
            disabled={!quizStarted || quizEnded}
            style={{
                color: 'black',
                borderColor: 'black',
                backgroundColor: 'red'
            }}
            >
            Reset
            </button>
          </div>
            <div style={{ marginRight: '2em' }}>
              <div style={{ marginLeft: '1.5em', display: 'flex', alignItems: 'center' }}>
              {browserSupportsSpeechRecognition ? (
                <>
                  <button
                    onClick={() => SpeechRecognition.startListening({ continuous: true, language: 'en-US' })}
                    disabled={disabled}
                    style={{ marginRight: '10px' }}
                  >
                    🎤 Start Voice
                  </button>
                  <button
                    onClick={SpeechRecognition.stopListening}
                    disabled={disabled}
                  >
                    🛑 Stop Voice
                  </button>
                  <span style={{ marginLeft: '1em', color: listening ? 'green' : 'gray' }}>
                    {listening ? 'Listening...' : 'Not listening'}
                  </span>
                </>
              ) : (
                <span>Your browser does not support speech recognition.</span>
              )}
              <span style={{ marginLeft: '1em', fontWeight: 'bold', fontSize: '2em' }}>
                {quizStarted ? `${minutes}:${seconds}` : '15:00'}
                </span>
            </div>  
          </div>
      </div>
    </div>
  );
}

export default Header;