import React, { useEffect, useRef, useState } from 'react';
import AudioSource from './audio/AudioSource';
import AudioAnalyzer from './audio/AudioAnalyzer';
import * as d3 from 'd3';

const App = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<AudioSource | null>(null);
  const analyzerRef = useRef<AudioAnalyzer | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioSource = new AudioSource("/Ember-Kubbi.mp3");
    const audioElement = audioSource.getAudioElement();
    audioElement.crossOrigin = "anonymous";

    audioSourceRef.current = audioSource;
    audioRef.current = audioElement;
  }, []);

  const playAudio = () => {
    setIsPlaying(true);

    if (audioSourceRef.current && !audioSourceRef.current.getAudioContext()) {
      audioSourceRef.current.initializeAudio();
      analyzerRef.current = new AudioAnalyzer(audioSourceRef.current);
    }

    if (audioRef.current) {
      audioRef.current.play();
      // Visualize audio data every 100ms
      const intervalId = setInterval(() => {
        if (analyzerRef.current) {
          const frequencyData = analyzerRef.current.getFrequencyData();
          visualizeAudioData(frequencyData);
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

  const visualizeAudioData = (frequencyData: Uint8Array) => {
    const svg = d3.select(svgRef.current);
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = +svg.attr('width')! - margin.left - margin.right;
    const height = +svg.attr('height')! - margin.top - margin.bottom;
    const barWidth = Math.ceil(width / frequencyData.length);

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    svg.selectAll("*").remove();  // Clear the SVG

    const g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    x.domain([0, frequencyData.length]);
    y.domain([0, d3.max(frequencyData)!]);

    g.selectAll('.bar')
        .data(frequencyData)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => x(i)!)
        .attr('width', barWidth)
        .attr('y', d => y(d)!)
        .attr('height', d => height - y(d)!);
};


  return (
    <div className="App">
      <header className="App-header">
      <svg ref={svgRef} width="800" height="400" />
        <button onClick={() => isPlaying ? pauseAudio() : playAudio()}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <audio ref={audioRef} />
      </header>
    </div>
  );
}

export default App;
