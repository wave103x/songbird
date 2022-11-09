const scoreDiv = document.querySelector('.scoreValue');

function updateScore({score}) {
  scoreDiv.textContent = score;
}

export default updateScore;