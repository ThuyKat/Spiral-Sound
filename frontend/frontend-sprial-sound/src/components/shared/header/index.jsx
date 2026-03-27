import logo from '../../assets/spiral_logo.png';
export default function Header() {
  return (
    <header>
      <a href="/">
        <img src={logo} alt="Spiral Sounds Logo" />
      </a>
      <div class="header-text">
        <h1>Spiral Sounds</h1>
        <p class="subhead">The best in vinyl</p>
      </div>
    </header>
  );
}
