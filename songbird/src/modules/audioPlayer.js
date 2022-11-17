import birdsData from '../data/birdsData.json';
import playSvg from '../assets/icon/play.svg'
import pauseSvg from '../assets/icon/pause.svg'

function audioPlayer(url) {

  const audioPlayer = document.createElement('div');
  audioPlayer.className = 'audio-player';
  const audio = document.createElement('audio');
  audio.className = 'my-audio';
  const controls = document.createElement('div');
  controls.className = 'controls';
  const timebar = document.createElement('div');
  timebar.className = 'timebar';
  const timer = document.createElement('div');
  timer.className = 'timer';
  const btnPlay = document.createElement('button');
  btnPlay.className = 'button_play';

  const btnPlayIcon = document.createElement('img');
  btnPlayIcon.src = playSvg;
  const btnPauseIcon = document.createElement('img');
  btnPauseIcon.src = pauseSvg;


  const progress = document.createElement('input');
  progress.setAttribute('type', 'range');
  progress.className = 'progress';
  const volume = document.createElement('input');
  volume.className = 'volume';
  volume.setAttribute('type', 'range');
  volume.setAttribute('value', '100');
  const currentTimeDiv = document.createElement('span');
  currentTimeDiv.className = 'current-time';
  const durationTime = document.createElement('span');
  durationTime.className = 'duration-time';
  btnPlay.append(btnPlayIcon);
  timer.append(currentTimeDiv, durationTime);
  timebar.append(progress, timer,volume);
  controls.append(btnPlay, timebar);
  audioPlayer.append(audio,controls);

  audio.src = url;
  audio.addEventListener('loadedmetadata', () => {
    progress.max = Math.floor(audio.duration);
    progress.value = 0;
    durationTime.textContent = calcTime(audio.duration);
    currentTimeDiv.textContent = '00 : 00'
  })

  btnPlay.onclick = playPause;

  audio.addEventListener('timeupdate', () => {
    currentTimeDiv.textContent = calcTime(audio.currentTime);
    progress.value = Math.floor(audio.currentTime);
  })

  progress.addEventListener('change', () => {
    // btnPlayIcon.src = pauseSvg;
    audio.currentTime = progress.value;
  })

  progress.addEventListener('input', () => {
    audio.pause();
    audio.currentTime = progress.value;
  })

  progress.addEventListener('mouseup', () => {
    audio.play();
  })

  volume.addEventListener('input', () => {
    audio.volume = volume.value / 100;
  })

  audio.onpause = () => {
    btnPlayIcon.src = playSvg;
  }

  audio.onplay = () => {
    btnPlayIcon.src = pauseSvg;
  }


  function playPause() {
    if (audio.paused) {
      audio.play()
    } else {
      audio.pause()
    }
  }

  function calcTime(secs) {
    const mins = Math.floor(secs / 60);
    const sec = Math.floor(secs % 60);
    return String(mins).padStart(2, '0') + ' : ' + String(sec).padStart(2, '0');
  }

  return audioPlayer;
}




export default audioPlayer;