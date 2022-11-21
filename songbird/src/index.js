import './scss/main.scss';
import birdBlack from './assets/icon/bird-black.svg'
import birdsData from './data/birdsDataEn.json';
import shuffleArr from './utils/shaffleArray';
import updateScore from './utils/updateScoreValue';
import randomInteger from './utils/randomInteger';
import soundVictory from './assets/audio/win.mp3';
import soundLoose from './assets/audio/loose1.mp3';
import audioPlayer from './modules/audioPlayer';
import { form as translateForm, lang } from './modules/translate';
import qbokSvg from './assets/icon/qbok.svg';
import './utils/consoleCheck'

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
const nextBtn = document.querySelector('.question__button-next');
const questionList = document.querySelector('.question-list');
const btnGallery = document.querySelector('.header__button_gallery');
const btnNewGame = document.querySelector('.header__button_new-game');
const questionBody = document.querySelector('.question__bird-audio');
const livePlayers = document.getElementsByClassName('audio-player');
const questionRight = document.querySelector('.question-right__bird');

const statsObj = {
  currentQuestion: 1,
  score: 0,
  currentTry: 0,
}
let winCount = 0;
if (localStorage.getItem('winCount')) {
  winCount = localStorage.getItem('winCount');
  createGift(winCount);
}

soundLoos.volume = 0.4;

translateForm.onchange = () => {
  const gallery = document.querySelector('.gallery');
  if (gallery) {
    gallery.remove();
    showGallery();
  }
  else newGame();
}

logo.onclick = toStartPage;
btnNewGame.onclick = newGame;
btnGallery.onclick = showGallery;
btnBegin.onclick = () => {
  greet.hidden = true;
  newGame();
  quiz.hidden = false;
  btnNewGame.hidden = false;
}

nextBtn.addEventListener('click', () => {

  if (statsObj.currentQuestion === 6) {
    gratz(statsObj);
    nextBtn.classList.add('question__button-next_inactive')
    return;
  }
  statsObj.currentQuestion++;
  nextQuestion();
});


function newGame() {
  statsObj.objDataBird = createQuestionsOptions(birdsData);
  statsObj.currentQuestion = 1;
  statsObj.score = 0;
  statsObj.currentTry = 0;
  nextQuestion();
  updateScore(statsObj);
}

function nextQuestion() {
  questionRight.hidden = true;

  window.scrollTo(0, 0);
  //choose random question and shuffle options
  let currentQuestionArr = 'arr' + (statsObj.currentQuestion - 1);
  let currentQuestionOptions = shuffleArr(statsObj.objDataBird[currentQuestionArr]);
  let currentWinner = currentQuestionOptions[randomInteger(0, 5)];

  //set auido track to guess

  if (livePlayers.length) livePlayers.item(0).remove();
  const player = audioPlayer(currentWinner.audio);
  birdDesctiption.before(player);

  //write option names to buttons, handle events on options click
  Array.from(optionsList.children).forEach((e, index) => {
    e.classList.remove('button_active_false');
    e.classList.remove('button_active_true');
    e.onclick = null;
    if (lang) e.textContent = currentQuestionOptions[index].nameEn;
    else e.textContent = currentQuestionOptions[index].name;
    e.onclick = (e) => handleOption(e, currentWinner, currentQuestionOptions, player);
    statsObj.currentTry = 0;
  })

  Array.from(questionList.children).forEach((e, index) => {
    if (index < statsObj.currentQuestion * 2 - 2) e.classList.add('question-list__item_past')
    else e.classList.remove('question-list__item_past');
    if (index === statsObj.currentQuestion * 2 - 2) e.classList.add('question-list__item_active');
    else e.classList.remove('question-list__item_active');
  })

  //reset UI
  nextBtn.classList.add('question__button-next_inactive');
  nextBtn.classList.remove('question__button-next_mobile');
  if (lang) birdName.textContent = '***';
  else birdName.textContent = '***';
  if (lang) birdDesctiption.textContent = 'Listen to the sounds and guess the bird';
  else birdDesctiption.textContent = 'Прослушайте пение и угадайте птицу';
  birdImg.classList.add('question-bird__img_empty');
  birdImg.src = birdBlack;

  console.log(currentWinner.nameEn, currentWinner.name);
}

function handleOption(event, currentWinner, currentQuestionOptions, player) {
  const winner = (lang) ? currentWinner.nameEn : currentWinner.name;
  if (event.target.textContent === winner) {
    nextBtn.classList.add('question__button-next_mobile');
    event.target.classList.add('button_active_true');
    soundVict.play();
    statsObj.score += 5 - statsObj.currentTry;
    nextBtn.classList.remove('question__button-next_inactive');
    uncoverBird(currentWinner);
    uncoverBirdRight(currentWinner);
    updateScore(statsObj);
    showAllBirds(currentQuestionOptions);
    player.firstElementChild.pause();
    if (statsObj.currentQuestion === 6) {
      if (lang) nextBtn.textContent = 'Get a gift!';
      else nextBtn.textContent = 'Получить по заслугам!';
    } else {
      if (lang) nextBtn.textContent = 'Next';
      else nextBtn.textContent = 'Далее';
    }
  } else {
    const [clickedBird] = Array.from(currentQuestionOptions).filter(e => e.name === event.target.textContent || e.nameEn === event.target.textContent)
    // uncoverBird(clickedBird);
    uncoverBirdRight(clickedBird);
    soundLoos.currentTime = 0;
    soundLoos.play();
    event.target.classList.add('button_active_false')
    statsObj.currentTry += 1;
  }
}

function toStartPage() {
  greet.hidden = false;
  quiz.hidden = true;
  window.onclick = null;
  btnNewGame.hidden = true;
  questionRight.hidden = true;
  if (document.querySelector('.gallery')) document.querySelector('.gallery').remove();
}

function showGallery() {
  if (document.querySelector('.gallery')) document.querySelector('.gallery').remove();
  const galleryDiv = document.createElement('article');
  galleryDiv.className = 'gallery';
  document.body.firstElementChild.append(galleryDiv);
  greet.hidden = true;
  btnNewGame.hidden = true;
  quiz.hidden = true;
  // const player = document.querySelector('.audio-player');
  // if (player) player.remove();
  if (livePlayers.length) livePlayers.item(0).remove();

  birdsData.forEach((e) => {
    uncoverBird(e)
    const clone = questionBody.cloneNode(true);
    galleryDiv.append(clone);
    const player = audioPlayer(e.audio);
    clone.lastElementChild.prepend(player)
  })
  makeForest()
}

function showAllBirds(currentQuestionOptions) {
  Array.from(optionsList.children).forEach(e => {
    e.style.pointerEvents = 'auto';
    e.onclick = null;
    e.onclick = () => {
      const bird = e.textContent;
      let birdObj;
      for (const item of currentQuestionOptions) {
        if (item.name === bird || item.nameEn === bird) birdObj = item;
      }
      uncoverBirdRight(birdObj);
      // livePlayers.item(0).remove();
      // const player = audioPlayer(birdObj.audio);
      // birdDesctiption.before(player);
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

function uncoverBird(birdObj) {
  if (lang) {
    birdDesctiption.textContent = birdObj.descEn;
    birdName.textContent = birdObj.nameEn;
  } else {
    birdDesctiption.textContent = birdObj.description;
    birdName.textContent = birdObj.name;
  }
  birdImg.src = birdObj.image;
  birdImg.classList.remove('question-bird__img_empty');
}

function uncoverBirdRight(birdObj) {
  questionRight.hidden = false;
  if (lang) {
    questionRight.children[0].textContent = birdObj.nameEn;
    questionRight.children[1].textContent = birdObj.species;
    const player = audioPlayer(birdObj.audio);
    questionRight.children[3].innerHTML = '';
    questionRight.children[3].append(player);
    questionRight.children[4].textContent = birdObj.descEn;
  } else {
    questionRight.children[0].textContent = birdObj.name;
    questionRight.children[1].textContent = birdObj.species;
    questionRight.children[3].innerHTML = '';
    const player = audioPlayer(birdObj.audio);
    questionRight.children[3].append(player);
    questionRight.children[4].textContent = birdObj.description;
  }
  questionRight.children[2].hidden = false;
  questionRight.children[2].src = birdObj.image;
}


function gratz({ score }) {
  document.body.firstElementChild.style.filter = 'blur(4px)';
  document.body.firstElementChild.style.pointerEvents = 'none';
  const gratz = document.createElement('div');
  gratz.className = 'gratz';
  const text = document.createElement('p');
  const ura = document.createElement('p');
  text.className = 'gratz__text';
  ura.className = 'gratz__ura';
  gratz.append(ura, text);
  const buttonNextTry = document.createElement('button');
  buttonNextTry.className = 'button button_gratz';
  gratz.append(buttonNextTry);
  document.body.prepend(gratz);
  if (score < 30) {
    if (lang) {
      ura.textContent = 'So close!';
      text.innerHTML = `You managed to get<br>${score} points of 30!`;
      buttonNextTry.textContent = 'One more try';

    } else {
      ura.textContent = 'Близко!';
      text.innerHTML = `У тебя получилось набрать <br>${score} баллов из 30!`;
      buttonNextTry.textContent = 'Попробовать ещё раз';
    }
    buttonNextTry.onclick = () => {
      gratz.remove();
      document.body.firstElementChild.style.pointerEvents = 'unset';
      document.body.firstElementChild.style.filter = null;
      newGame();
    }
  } else {
    if (lang) {
      ura.textContent = 'Hooray!';
      text.innerHTML = `You don't know what mistake is!`;
      buttonNextTry.textContent = 'I am good';
    }
    else {
      ura.textContent = 'Ура!';
      text.innerHTML = `Ни одной ошибки!`;
      buttonNextTry.textContent = 'Я хорош';
    }
    buttonNextTry.onclick = () => {
      gratz.remove();
      document.body.firstElementChild.style.pointerEvents = 'unset';
      document.body.firstElementChild.style.filter = null;
      toStartPage();
    }
    winCount++;
    localStorage.setItem('winCount', winCount);
    createGift(winCount)
  }
}

function createGift(winCount = '1') {
  const gift = document.createElement('div');
  const qbok = document.createElement('img');
  qbok.src = qbokSvg;
  gift.className = 'gift';
  document.body.append(gift);
  gift.append(qbok);
  gift.dataset.place = winCount;
}

function makeForest() {
  const audios = document.querySelectorAll('audio');
  const SINGERS_COUNT = 3;
  const buttonStart = document.createElement('button')
  buttonStart.className = 'button lng-forestBtn';
  buttonStart.style.marginBottom = '1rem';
  buttonStart.style.marginRight = '1rem';
  if (lang) buttonStart.textContent = 'Forest sounds';
  else buttonStart.textContent = 'Звуки леса';

  const buttonStop = document.createElement('button')
  buttonStop.className = 'button lng-forestBtnStop';
  buttonStop.style.marginRight = '1rem';
  buttonStop.style.marginBottom = '1rem';
  if (lang) buttonStop.textContent = 'Stop';
  else buttonStop.textContent = 'Стоп';

  const singersText = document.createElement('span');
  singersText.style.opacity = '0.7';

  document.body.firstElementChild.lastElementChild.prepend(buttonStart, buttonStop, singersText);

  buttonStart.onclick = () => {
    audios.forEach((e) => {
      e.currentTime = 0;
      e.pause();
    })
    const singers = [];
    singersText.innerHTML = '';
    for (let i = 0; i < SINGERS_COUNT; i++) {
      singers.push(randomInteger(0, audios.length - 1))
      audios[singers[i]].play();
      singersText.innerHTML += audios[singers[i]].closest('.question__bird-audio').firstElementChild.lastElementChild.textContent + ' ';
    }
  }

  buttonStop.onclick = () => {
    singersText.innerHTML = '';
    audios.forEach((e) => {
      e.currentTime = 0;
      e.pause();
    })
  }

}
