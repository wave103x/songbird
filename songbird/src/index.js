import './scss/main.scss';
import birdPlaceholder from './assets/icon/bird-black.svg';
import birdBanner from './assets/image/bird-banner.webp'
import birdsData from './data/birdsData.json';
import shuffleArr from './utils/shaffleArray';
import updateScore from './utils/updateScoreValue';
import randomInteger from './utils/randomInteger';
import soundVictory from './assets/audio/win.mp3';

const btnBegin = document.querySelector('.greet_button');
const greet = document.querySelector('.greet');

const statsObj = {
  currentQuestion: 1,
  score: 0,
  currentTry: 0,
}

/* second page */
const birdDesctiption = document.querySelector('.question__description');
const birdName = document.querySelector('.question-bird__name');
const birdImg = document.querySelector('.question-bird__img');
const soundVict = new Audio(soundVictory);
const optionsList = document.querySelector('.question__answers-list');
const nextBtn = document.querySelector('.question_button-next');

//create object with options per question
const arr = [0,1,2,3,4,5];
const arrRandom = shuffleArr(arr);
const objDataBird = {};
for (let i = 0; i < 6; i++) {
  const name = 'arr' + arrRandom[i];
  objDataBird[name] = birdsData.slice(i * 6, i * 6 + 6);
}


//choose random question and shuffle options
let currentQuestionArr = 'arr' + (statsObj.currentQuestion - 1);
let currentQuestionOptions = shuffleArr(objDataBird[currentQuestionArr]);
let currentWinner = currentQuestionOptions[randomInteger(0, 5)];

//write option names to buttons, handle events on options click
Array.from(optionsList.children).forEach((e, index) => {
  e.textContent = currentQuestionOptions[index].name;
  e.addEventListener('click', handleOption);
  statsObj.currentTry = 0;
})

//set auido track to guess
const audioPlayer = document.querySelector('.question__audio');
audioPlayer.firstElementChild.setAttribute('src', currentWinner.audio);
audioPlayer.firstElementChild.setAttribute('type', 'audio/mp3');
audioPlayer.load();

function handleOption(event) {
  console.log(event.target.textContent, currentWinner.name)
  if (event.target.textContent === currentWinner.name) {
    event.target.style.backgroundColor = 'green';
    birdDesctiption.textContent = currentWinner.description;
    birdName.textContent = currentWinner.name;
    birdImg.src = currentWinner.image;
    soundVict.play();
    statsObj.score += 5 - statsObj.currentTry;
    updateScore(statsObj);
    nextBtn.hidden = false;
  } else {
    event.target.style.backgroundColor = 'tomato';
    statsObj.currentTry += 1;
  }
}



function nextQuestion() {

}