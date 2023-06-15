import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import AudioSource from './audio/AudioSource';
import AudioAnalyzer from './audio/AudioAnalyzer';

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<AudioSource | null>(null);
  const analyzerRef = useRef<AudioAnalyzer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    setIsPlaying(true);
    if (audioSourceRef.current && !audioSourceRef.current.getAudioContext()) {
      audioSourceRef.current.initializeAudio();
      analyzerRef.current = new AudioAnalyzer(audioSourceRef.current);
    }

    if (audioRef.current) {
      audioRef.current.play();

      // Analyze audio data every 100ms
      const intervalId = setInterval(() => {
        if (analyzerRef.current) {
          const frequencyData = analyzerRef.current.getFrequencyData();
          console.log(frequencyData);
        }
      }, 100);

      // Clear the interval when the music stops
      audioRef.current.onended = () => {
        clearInterval(intervalId);
      }
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

    audioSourceRef.current = audioSource;
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
