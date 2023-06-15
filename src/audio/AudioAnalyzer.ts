import AudioSource from './AudioSource';

export default class AudioAnalyzer {
  private audioContext: AudioContext | null;
  private audioSourceNode: MediaElementAudioSourceNode | null;
  private analyser: AnalyserNode | null;
  private dataArray: Uint8Array;

  constructor(audioSource: AudioSource) {
    this.audioContext = audioSource.getAudioContext();
    this.audioSourceNode = audioSource.getAudioSourceNode();
    this.analyser = null;
    this.dataArray = new Uint8Array(0);

    if (this.audioContext && this.audioSourceNode) {
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.audioSourceNode.connect(this.analyser);
      this.audioSourceNode.connect(this.audioContext.destination);
    }
  }

  getFrequencyData(): Uint8Array {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.dataArray);
    }
    return this.dataArray;
  }
}
