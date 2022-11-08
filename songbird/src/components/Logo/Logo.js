import './Logo.scss';

function Logo() {
  const logoText = document.createElement('h1');
  logoText.innerHTML = `song<span>bird</span>`;
  logoText.className = 'logo'
  return logoText;
}

export default Logo;