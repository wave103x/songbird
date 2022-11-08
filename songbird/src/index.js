import './scss/main.scss';
import Logo from './components/Logo/Logo';
import Greet from './components/Greet/Greet';
import Button from './components/Button/Button';
import Quiz from './components/Quiz/Quiz'

const main = document.querySelector('.main');

const header = document.createElement('header');
header.className = 'header';
main.prepend(header);
header.append(Logo());
header.append(Button('начать викторину'))

const greet = main.appendChild(Greet());



main.append(Quiz());