import birdsData from '../data/birdsData.json';

const audio = document.querySelector('.my-audio');
const currentTimeDiv = document.querySelector('.current-time')
const durationTime = document.querySelector('.duration-time')
const volume = document.querySelector('.volume')
const progress = document.querySelector('.progress');
const btnPlay = document.querySelector('.button_play');

function audioPlayer(source) {

  // const audioPlayer = document.createElement('div');
  // audioPlayer.className = 'audio-player';
  // const audio = document.createElement('audio');
  // audio.className = 'my-audio';
  // const controls = document.createElement('div');
  // controls.className = 'controls';
  // const timebar = document.createElement('div');
  // timebar.className = 'timebar';
  // const timer = document.createElement('div');
  // timer.className = 'timer';
  // const btnPlay = document.createElement('button');
  // btnPlay.className = 'button_play';
  // const btnSpan = document.createElement('span');
  // btnSpan.className = 'material-symbols-outlined';
  // const progress = document.createElement('input');
  // progress.setAttribute('type', 'range');
  // progress.className = 'progress';
  // const volume = document.createElement('input');
  // volume.className = 'volume';
  // volume.setAttribute('type', 'range');
  // volume.setAttribute('value', '100');
  // const currentTimeDiv = document.createElement('span');
  // currentTimeDiv.className = 'current-time';
  // const durationTime = document.createElement('span');
  // durationTime.className = 'duration-time';
  // btnPlay.append(btnSpan);
  // timer.append(durationTime, currentTimeDiv);
  // timebar.append(progress, timer,volume);
  // controls.append(btnPlay, timebar);
  // audioPlayer.append(audio,controls);
  audio.src = source;
  audio.addEventListener('loadedmetadata', () => {
    btnPlay.firstElementChild.textContent = 'play_circle';
    progress.max = Math.floor(audio.duration);
    durationTime.textContent = calcTime(audio.duration);
  })

  btnPlay.onclick = playPause;

  audio.addEventListener('timeupdate', () => {
    currentTimeDiv.textContent = calcTime(audio.currentTime);
    progress.value = Math.floor(audio.currentTime);
  })

  progress.addEventListener('change', () => {
    btnPlay.firstElementChild.textContent = 'pause_circle';
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


  function playPause() {
    if (audio.paused) {
      audio.play()
      btnPlay.firstElementChild.textContent = 'pause_circle';
    } else {
      audio.pause()
      btnPlay.firstElementChild.textContent = 'play_circle';
    }
  }

  function calcTime(secs) {
    const mins = Math.floor(secs / 60);
    const sec = Math.floor(secs % 60);
    return String(mins).padStart(2, '0') + ' : ' + String(sec).padStart(2, '0');
  }
  return audio;
}




export default audioPlayer;