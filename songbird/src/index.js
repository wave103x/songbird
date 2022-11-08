import './scss/main.scss';

const btnBegin = document.querySelector('.greet_button');
const greet = document.querySelector('.greet');

btnBegin.onclick = hideFirstScreen;

function hideFirstScreen() {
  greet.hidden = true;
}