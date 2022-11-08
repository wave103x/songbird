import './Quiz.scss';

function Quiz() {
  const quiz = document.createElement('div');

  const score = document.createElement('div');
  const scoreText = document.createElement('div');
  const scoreValue = document.createElement('div');
  scoreText.textContent = 'Ваш счёт: ';
  quiz.append(score);
  score.append(scoreText);
  score.append(scoreValue);


  return quiz;
}

export default Quiz;