const fs = require('fs/promises')
const path = require('path');

async function one() {
  const contents = await fs.readFile(path.join(__dirname, 'data', 'birdsData2.json'), { encoding: 'utf-8' });
  const res = await JSON.parse(contents);
  for (const item of res) {

    item.nameEn = 'name';
    item.descEn = 'desc';
    // item.nameEn = await toTranslate(item.name).data;
    // item.descEn = await toTranslate(item.description).data;

  }
  fs.writeFile(path.join(__dirname, 'data', 'birdsDataEn.json'), JSON.stringify(res))
}

one();

async function toTranslate(data) {
  const formElem = new FormData();
  formElem.append('source', data)
  formElem.append('lang', 'ru-en')

  return fetch('https://fasttranslator.herokuapp.com/api/v1/text/to/text', {
    method: 'POST',
    body: formElem,
  })
    .then(res => res.json())
}
