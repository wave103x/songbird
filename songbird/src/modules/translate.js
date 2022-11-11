import langData from '../data/translate.json';

const form = document.querySelector('.lang-switch');

if (localStorage.getItem('lang') && localStorage.getItem('lang') === 'en') {
  changeLang('en');
  form.lastElementChild.previousElementSibling.checked = true;
} else localStorage.setItem('lang', 'ru');


form.addEventListener('change', () => {
  const target = event.target.closest('input');
  if (!target) return;
  const lang = target.value;
  changeLang(lang);
});

function changeLang(lang) {
  localStorage.setItem('lang', lang)
  for (const item in langData) {
    try {
      document.querySelector(`.lng-${item}`).textContent = langData[item][lang];
    } catch(err) {
      console.log(err)
    }
  }
}

export default form;