import langData from '../data/translate.json';

const form = document.querySelector('.lang-switch');
let lang;

if (localStorage.getItem('lang') && localStorage.getItem('lang') === 'en') {
  translate('en');
  lang = true;
  form.lastElementChild.previousElementSibling.checked = true;
} else {
  localStorage.setItem('lang', 'ru');
  lang = false;
}

form.addEventListener('change', () => {
  const target = event.target.closest('input');
  if (!target) return;
  const language = target.value;
  lang = language === 'en' ? true : false;
  translate(language);
});

function translate(language) {
  localStorage.setItem('lang', language)
  for (const item in langData) {
    try {
      document.querySelector(`.lng-${item}`).textContent = langData[item][language];
    } catch (err) {
      console.log(err)
    }
  }
}

export { lang, form }