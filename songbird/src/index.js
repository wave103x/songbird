import './scss/main.scss';
import './assets/icon/Favicon.png';
import birdPlaceholder from './assets/icon/bird-black.svg';
import birdBanner from './assets/image/bird-banner.webp'
import birdsData from './data/birdsData.json';
import shuffleArr from './utils/shaffleArray';
import updateScore from './utils/updateScoreValue';
import randomInteger from './utils/randomInteger';
import soundVictory from './assets/audio/win.mp3';
import soundLoose from './assets/audio/loose1.mp3';

const statsObj = {
  currentQuestion: 1,
  score: 0,
  currentTry: 0,
}

const logo = document.querySelector('.logo');
const btnBegin = document.querySelector('.greet_button');
const greet = document.querySelector('.greet');
const quiz = document.querySelector('.quiz');
const birdDesctiption = document.querySelector('.question__description');
const birdName = document.querySelector('.question-bird__name');
const birdImg = document.querySelector('.question-bird__img');
const soundVict = new Audio(soundVictory);
const soundLoos = new Audio(soundLoose);
const optionsList = document.querySelector('.question__answers-list');
const nextBtn = document.querySelector('.question_button-next');
const questionList = document.querySelector('.question-list');
const btnGallery = document.querySelector('.header__button_gallery');
const btnNewGame = document.querySelector('.header__button_new-game');

soundLoos.volume = 0.4;
logo.onclick = toStartPage;
btnNewGame.onclick = newGame;
//fake final page
btnGallery.onclick = () => gratz(statsObj);

//create object with options per question
const arr = [0, 1, 2, 3, 4, 5];
const arrRandom = shuffleArr(arr);
const objDataBird = {};
for (let i = 0; i < 6; i++) {
  const name = 'arr' + arrRandom[i];
  objDataBird[name] = birdsData.slice(i * 6, i * 6 + 6);
}

btnBegin.onclick = () => {
  greet.hidden = true;
  // nextQuestion();
  newGame();
  quiz.hidden = false;
  btnNewGame.hidden = false;
}

nextBtn.addEventListener('click', () => {
  if (statsObj.currentQuestion === 6) {
    gratz(statsObj);
    return;
  }
  statsObj.currentQuestion++;
  nextBtn.hidden = true;
  birdName.textContent = 'Птица ' + statsObj.currentQuestion;
  birdDesctiption.textContent = 'Прослушайте пение и угадайте птицу';
  birdImg.src = './assets/bird-black.svg';
  nextQuestion();
});

function nextQuestion() {
  //choose random question and shuffle options
  let currentQuestionArr = 'arr' + (statsObj.currentQuestion - 1);
  let currentQuestionOptions = shuffleArr(objDataBird[currentQuestionArr]);
  let currentWinner = currentQuestionOptions[randomInteger(0, 5)];
  console.log('winner', currentWinner.name)

  //write option names to buttons, handle events on options click
  Array.from(optionsList.children).forEach((e, index) => {
    e.classList.remove('button_active_false');
    e.classList.remove('button_active_true');
    e.onclick = null
    e.textContent = currentQuestionOptions[index].name;
    e.onclick = (e) => handleOption(e, currentWinner);
    statsObj.currentTry = 0;
  })

  Array.from(questionList.children).forEach((e, index) => {
    if (index === statsObj.currentQuestion - 1) e.classList.add('question-list__item_active');
    else e.classList.remove('question-list__item_active')
  })

  //set auido track to guess
  const audioPlayer = document.querySelector('.question__audio');
  audioPlayer.firstElementChild.setAttribute('src', currentWinner.audio);
  audioPlayer.firstElementChild.setAttribute('type', 'audio/mp3');
  audioPlayer.load();
}

function handleOption(event, currentWinner) {
  if (event.target.textContent === currentWinner.name) {
    event.target.classList.add('button_active_true')
    birdDesctiption.textContent = currentWinner.description;
    birdName.textContent = currentWinner.name;
    birdImg.src = currentWinner.image;
    soundVict.play();
    statsObj.score += 5 - statsObj.currentTry;
    updateScore(statsObj);
    nextBtn.hidden = false;
  } else if (nextBtn.hidden) {
    soundLoos.currentTime = 0;
    soundLoos.play();
    event.target.classList.add('button_active_false')
    statsObj.currentTry += 1;
  }
}

function gratz({score}) {
  const gratz = document.createElement('div');
  gratz.className = 'gratz';
  const text = document.createElement('p');
  text.textContent = `Ура! У тебя получилось набрать ${score} баллов из 30!`;
  text.className = 'gratz__text';
  gratz.append(text);
  const buttonNextTry = document.createElement('button');
  if (score < 30) {
    buttonNextTry.textContent = 'Попробовать ещё раз';
    buttonNextTry.className = 'button';
    gratz.append(buttonNextTry);
    buttonNextTry.onclick = () => newGame();
  }
  document.body.lastElementChild.style.filter = 'blur(4px)';
  document.body.lastElementChild.style.pointerEvents = 'none';
  document.body.prepend(gratz);
}

function newGame() {
  document.body.lastElementChild.style.filter = null;
  statsObj.currentQuestion = 1;
  statsObj.score = 0;
  statsObj.currentTry = 0;
  if (document.querySelector('.gratz')) document.querySelector('.gratz').remove();
  document.body.lastElementChild.style.pointerEvents = 'unset';
  nextQuestion();
  updateScore(statsObj);
}

function toStartPage() {
  greet.hidden = false;
  quiz.hidden = true;
  btnNewGame.hidden = true;
}
