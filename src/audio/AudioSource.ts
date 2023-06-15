export default class AudioSource {
    private audioContext: AudioContext | null;
    private audioElement: HTMLAudioElement;
    private audioSourceNode: MediaElementAudioSourceNode | null;
  
    constructor(audioFile: string) {
      this.audioContext = null;
      this.audioElement = new Audio(audioFile);
      this.audioElement.crossOrigin = "anonymous";
      this.audioSourceNode = null;
    }
  
    private createAudioContext(): AudioContext {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      return new AudioContext();
    }
  
    private createAudioSourceNode(): MediaElementAudioSourceNode | null {
      if (!this.audioContext || !this.audioElement) {
        return null;
      }
      return this.audioContext.createMediaElementSource(this.audioElement);
    }
  
    initializeAudio() {
      this.audioContext = this.createAudioContext();
      this.audioSourceNode = this.createAudioSourceNode();
      if (this.audioContext && this.audioSourceNode) {
        this.audioSourceNode.connect(this.audioContext.destination);
      }
    }
  
    play() {
      if (this.audioElement.paused) {
        this.audioElement.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
    }
  
    pause() {
      if (!this.audioElement.paused) {
        this.audioElement.pause();
      }
    }
  
    getAudioElement(): HTMLAudioElement {
      return this.audioElement;
    }
  
    getAudioContext(): AudioContext | null {
      return this.audioContext;
    }
  
    getAudioSourceNode(): MediaElementAudioSourceNode | null {
      return this.audioSourceNode;
    }
  }
  