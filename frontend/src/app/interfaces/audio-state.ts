export interface AudioState {

  playing: boolean;
  readableCurrentTime: string;
  readableDuration: string;
  duration: number | undefined;
  currentTime: number | undefined;
  canplay: boolean;
  error: boolean;

  // Extra stuff
  onSeekState: boolean;
  songEnd: boolean;
  shuffle: boolean;
  repeat: boolean;

}
