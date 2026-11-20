// Gentle polyphonic Web Audio piano/celesta melody for Vietnamese Teachers' Day (20/11)

interface NoteEvent {
  freq: number;
  duration: number; // in beats
  harmony?: number;
}

// Warm nostalgic 3/4 waltz melody in F Major (inspired by peaceful classroom ballads)
const MELODY_SEQUENCE: NoteEvent[] = [
  { freq: 349.23, duration: 1, harmony: 174.61 }, // F4 + F3
  { freq: 440.0, duration: 1 }, // A4
  { freq: 523.25, duration: 1 }, // C5
  { freq: 587.33, duration: 2, harmony: 233.08 }, // D5 + Bb3
  { freq: 523.25, duration: 1 }, // C5

  { freq: 440.0, duration: 2, harmony: 220.0 }, // A4 + A3
  { freq: 392.0, duration: 1 }, // G4
  { freq: 349.23, duration: 2.5, harmony: 174.61 }, // F4 + F3
  { freq: 0, duration: 0.5 },

  { freq: 392.0, duration: 1, harmony: 196.0 }, // G4 + G3
  { freq: 440.0, duration: 1 }, // A4
  { freq: 466.16, duration: 1 }, // Bb4
  { freq: 523.25, duration: 2, harmony: 261.63 }, // C5 + C4
  { freq: 440.0, duration: 1 }, // A4

  { freq: 392.0, duration: 2, harmony: 196.0 }, // G4 + G3
  { freq: 329.63, duration: 1 }, // E4
  { freq: 392.0, duration: 2.5, harmony: 261.63 }, // G4 + C4
  { freq: 0, duration: 0.5 },

  { freq: 523.25, duration: 1, harmony: 220.0 }, // C5 + A3
  { freq: 587.33, duration: 1 }, // D5
  { freq: 698.46, duration: 1 }, // F5
  { freq: 659.25, duration: 2, harmony: 261.63 }, // E5 + C4
  { freq: 587.33, duration: 1 }, // D5

  { freq: 523.25, duration: 2, harmony: 233.08 }, // C5 + Bb3
  { freq: 440.0, duration: 1 }, // A4
  { freq: 466.16, duration: 2, harmony: 196.0 }, // Bb4 + G3
  { freq: 392.0, duration: 1 }, // G4

  { freq: 440.0, duration: 1.5, harmony: 174.61 }, // A4 + F3
  { freq: 392.0, duration: 0.5 }, // G4
  { freq: 349.23, duration: 1 }, // F4
  { freq: 329.63, duration: 1.5, harmony: 261.63 }, // E4 + C4
  { freq: 392.0, duration: 1.5 }, // G4
  { freq: 349.23, duration: 3, harmony: 174.61 }, // F4 + F3
];

const BEAT_MS = 520; // ~115 BPM gentle 3/4 waltz

class GentleMusicPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private stepIndex = 0;
  private playing = false;

  public isPlaying(): boolean {
    return this.playing;
  }

  public start(): void {
    if (this.playing) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, this.ctx.currentTime);

      this.masterGain.connect(filter);
      filter.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    this.playing = true;
    this.scheduleNext();
  }

  public pause(): void {
    this.playing = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.playing) {
      this.pause();
      return false;
    }
    this.start();
    return true;
  }

  private scheduleNext(): void {
    if (!this.playing || !this.ctx || !this.masterGain) return;

    const note = MELODY_SEQUENCE[this.stepIndex];
    const durationSec = (note.duration * BEAT_MS) / 1000;

    if (note.freq > 0) {
      this.playTone(note.freq, durationSec, 0.28);
    }
    if (note.harmony && note.harmony > 0) {
      this.playTone(note.harmony, durationSec * 1.35, 0.14);
    }

    this.stepIndex = (this.stepIndex + 1) % MELODY_SEQUENCE.length;
    this.timerId = window.setTimeout(() => this.scheduleNext(), note.duration * BEAT_MS);
  }

  private playTone(freq: number, durationSec: number, peakGain: number): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Primary soft sine body
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Subtle warm overtone
    const overtone = this.ctx.createOscillator();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 2, now);

    const noteGain = this.ctx.createGain();
    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.12, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(peakGain, now + 0.035);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.55, durationSec * 1.45));

    osc.connect(noteGain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    overtone.start(now);
    const stopAt = now + Math.max(0.6, durationSec * 1.5);
    osc.stop(stopAt);
    overtone.stop(stopAt);
  }
}

export const gentleMusicPlayer = new GentleMusicPlayer();
