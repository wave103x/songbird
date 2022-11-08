import './Button.scss';

function Button(text) {
  const button = document.createElement('button');
  button.textContent = text;
  button.className = 'button';
  return button;
}

export default Button;