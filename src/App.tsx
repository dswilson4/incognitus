import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import AudioSource from './audio/AudioSource';

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const pauseAudio = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    const audioSource = new AudioSource("/Ember-Kubbi.mp3");
    const audioElement = audioSource.getAudioElement();
    audioElement.crossOrigin = "anonymous";

    audioRef.current = audioElement;
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => isPlaying ? pauseAudio() : playAudio()}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <audio ref={audioRef} />
      </header>
    </div>
  );
}

export default App;
