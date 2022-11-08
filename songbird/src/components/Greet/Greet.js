import Button from '../Button/Button'
import './Greet.scss';
import birdBannerUrl from '../../assets/image/bird-banner.webp'

function Greet() {
  const greet = document.createElement('article');
  greet.className = 'greet';

  const birdBanner = new Image;
  birdBanner.src = birdBannerUrl;
  birdBanner.className = 'bird-banner greet-banner';
  greet.append(birdBanner)

  const greetHeading = document.createElement('h2');
  greetHeading.className = 'greet__heading';
  greetHeading.textContent = 'Что здесь происходит?';
  greet.append(greetHeading);

  const phrasesArr = [
    'Это викторина, здесь вы попробуете угадать птицу по её пению.',
    'Узнали с первой попытки - получите 5 баллов.',
    'Каждое неверное предположение - минус один балл.',
    'Приз только за выполнение без ошибок!',
    'Попытки не ограничены.'
  ];

  phrasesArr.forEach(elem => {
    const textElem = document.createElement('p');
    textElem.textContent = elem;
    greet.append(textElem);
  })

  const button = Button('приступить');
  greet.append(button)

  return greet;
}

export default Greet;