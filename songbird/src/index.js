import './scss/main.scss';
import birdBlack from './assets/icon/bird-black.svg'
import birdsData from './data/birdsDataEn.json';
import shuffleArr from './utils/shaffleArray';
import updateScore from './utils/updateScoreValue';
import randomInteger from './utils/randomInteger';
import soundVictory from './assets/audio/win.mp3';
import soundLoose from './assets/audio/loose1.mp3';
import audioPlayer from './modules/audioPlayer';
import translateForm from './modules/translate';

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
const questionBody = document.querySelector('.question__bird-audio');


soundLoos.volume = 0.4;
translateForm.onchange = () => {
  const gallery1 = document.querySelector('.gallery');
  if (gallery1) {
    gallery1.remove();
    gallery();
  }
  else newGame();
}

logo.onclick = toStartPage;
btnNewGame.onclick = newGame;
btnGallery.onclick = gallery;
// btnGallery.onclick = () => gratz(statsObj);
btnBegin.onclick = () => {
  greet.hidden = true;
  newGame();
  quiz.hidden = false;
  btnNewGame.hidden = false;
}

nextBtn.addEventListener('click', () => {
  if (statsObj.currentQuestion === 5) {
    if (localStorage.getItem('lang') === 'en') nextBtn.textContent = 'Get a gift!';
    else nextBtn.textContent = 'Получить по заслугам!';
  } else {
    if (localStorage.getItem('lang') === 'en') nextBtn.textContent = 'Next';
    else nextBtn.textContent = 'Далее';
  }
  if (statsObj.currentQuestion === 6) {
    gratz(statsObj);
    return;
  }
  statsObj.currentQuestion++;
  nextQuestion();
});


function newGame() {
  document.body.lastElementChild.style.filter = null;
  statsObj.currentQuestion = 1;
  statsObj.score = 0;
  statsObj.currentTry = 0;
  if (document.querySelector('.gratz')) document.querySelector('.gratz').remove();
  document.body.lastElementChild.style.pointerEvents = 'unset';
  nextBtn.hidden = true;
  nextQuestion();
  updateScore(statsObj);
}

const objDataBird = createQuestionsOptions(birdsData);

function nextQuestion() {
  //choose random question and shuffle options
  let currentQuestionArr = 'arr' + (statsObj.currentQuestion - 1);
  let currentQuestionOptions = shuffleArr(objDataBird[currentQuestionArr]);
  let currentWinner = currentQuestionOptions[randomInteger(0, 5)];
  console.log('w0w you are hascker!', currentWinner.name);

  //write option names to buttons, handle events on options click
  Array.from(optionsList.children).forEach((e, index) => {
    e.classList.remove('button_active_false');
    e.classList.remove('button_active_true');
    e.onclick = null;
    if (localStorage.getItem('lang') === 'en') e.textContent = currentQuestionOptions[index].nameEn;
    else e.textContent = currentQuestionOptions[index].name;
    e.onclick = (e) => handleOption(e, currentWinner, currentQuestionOptions);
    statsObj.currentTry = 0;
  })

  Array.from(questionList.children).forEach((e, index) => {
    if (index < statsObj.currentQuestion * 2 - 2) e.classList.add('question-list__item_past')
    else e.classList.remove('question-list__item_past');
    if (index === statsObj.currentQuestion * 2 - 2) e.classList.add('question-list__item_active');
    else e.classList.remove('question-list__item_active');
  })

  //set auido track to guess
  const player = audioPlayer(currentWinner.audio);
  birdDesctiption.before(player);

  //reset UI
  nextBtn.hidden = true;
  if (localStorage.getItem('lang') === 'en') birdName.textContent = 'Bird ' + statsObj.currentQuestion;
  else birdName.textContent = 'Птица ' + statsObj.currentQuestion;
  if (localStorage.getItem('lang') === 'en') birdDesctiption.textContent = 'Listen to the sounds and guess the bird';
  else birdDesctiption.textContent = 'Прослушайте пение и угадайте птицу';
  birdImg.classList.add('question-bird__img_empty');
  birdImg.src = birdBlack;
}

function handleOption(event, currentWinner, currentQuestionOptions) {
  const winner = (localStorage.getItem('lang') === 'en') ? currentWinner.nameEn : currentWinner.name;
  if (event.target.textContent === winner) {
    event.target.classList.add('button_active_true');
    if (localStorage.getItem('lang') === 'en') {
      birdDesctiption.textContent = currentWinner.descEn;
      birdName.textContent = currentWinner.nameEn;
    } else {
      birdDesctiption.textContent = currentWinner.description;
      birdName.textContent = currentWinner.name;
    }
    birdImg.src = currentWinner.image;
    birdImg.classList.remove('question-bird__img_empty');

    soundVict.play();
    statsObj.score += 5 - statsObj.currentTry;
    updateScore(statsObj);
    nextBtn.hidden = false;

    showAllBirds(currentQuestionOptions);

  } else if (nextBtn.hidden) {
    soundLoos.currentTime = 0;
    soundLoos.play();
    event.target.classList.add('button_active_false')
    statsObj.currentTry += 1;
  }
}

function gratz({ score }) {
  const gratz = document.createElement('div');
  gratz.className = 'gratz';
  const text = document.createElement('p');
  const ura = document.createElement('p');
  if (localStorage.getItem('lang') === 'en') text.innerHTML = `You managed to get<br>${score} points of 30!`;
  else text.innerHTML = `У тебя получилось набрать <br>${score} баллов из 30!`;
  text.className = 'gratz__text';
  ura.className = 'gratz__ura';
  if (localStorage.getItem('lang') === 'en') ura.textContent = 'Hooray!';
  else ura.textContent = 'Ура!';
  gratz.append(ura, text);
  const buttonNextTry = document.createElement('button');
  buttonNextTry.className = 'button button_gratz';
  gratz.append(buttonNextTry);
  buttonNextTry.onclick = () => newGame();
  if (score < 30) {
    if (localStorage.getItem('lang') === 'en') buttonNextTry.textContent = 'One more try';
    else buttonNextTry.textContent = 'Попробовать ещё раз';
  } else {
    if (localStorage.getItem('lang') === 'en') buttonNextTry.textContent = 'I am good';
    else buttonNextTry.textContent = 'Я хорош';
  }
  document.body.lastElementChild.style.filter = 'blur(4px)';
  document.body.lastElementChild.style.pointerEvents = 'none';
  document.body.prepend(gratz);
}



function toStartPage() {
  greet.hidden = false;
  quiz.hidden = true;
  window.onclick = null;
  btnNewGame.hidden = true;
  if (document.querySelector('.gallery')) document.querySelector('.gallery').remove();
}

function gallery() {
  const galleryDiv = document.createElement('article');
  galleryDiv.className = 'gallery';
  document.body.firstElementChild.append(galleryDiv);
  greet.hidden = true;
  btnNewGame.hidden = true;
  quiz.hidden = true;
  const player = document.querySelector('.audio-player');
  if (player) player.remove();

  birdsData.forEach((e) => {
    birdImg.classList.remove('question-bird__img_empty')
    birdImg.src = e.image;
    if (localStorage.getItem('lang') === 'en') {
      birdDesctiption.textContent = e.descEn;
      birdName.textContent = e.nameEn;
    } else {
      birdDesctiption.textContent = e.description;
      birdName.textContent = e.name;
    }
    const clone = questionBody.cloneNode(true);
    galleryDiv.append(clone);
    const player = audioPlayer(e.audio);
    clone.lastElementChild.prepend(player)
  })
}

function showAllBirds(currentQuestionOptions) {
  Array.from(optionsList.children).forEach(e => {
    e.style.pointerEvents = 'auto';
    e.onclick = null;
    e.onclick = () => {
      const bird = e.textContent;
      let data;
      for (const item of currentQuestionOptions) {
        if (item.name === bird || item.nameEn === bird) data = item;
      }
      if (localStorage.getItem('lang') === 'en') {
        birdDesctiption.textContent = data.descEn;
        birdName.textContent = data.nameEn;
      } else {
        birdDesctiption.textContent = data.description;
        birdName.textContent = data.name;
      }
      birdImg.src = data.image;
      birdImg.classList.remove('question-bird__img_empty');
      audioPlayer(data.audio)
    }
  })
}


function createQuestionsOptions(birdsData) {
  const arr = [0, 1, 2, 3, 4, 5];
  const arrRandom = shuffleArr(arr);
  const objDataBird = {};
  for (let i = 0; i < 6; i++) {
    const name = 'arr' + arrRandom[i];
    objDataBird[name] = birdsData.slice(i * 6, i * 6 + 6);
  }
  return objDataBird;
}