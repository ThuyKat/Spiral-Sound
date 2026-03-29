import logo from '../../../assets/spiral_logo.png';
import { Link } from 'react-router-dom';
import styles from './header.module.css';
export default function Header() {
  return (
    <header>
      <Link to="/">
        <img src={logo} alt="Spiral Sounds Logo" />
      </Link>
      <div className={styles['header-text']}>
        <h1>Spiral Sounds</h1>
        <p className={styles.subhead}>The best in vinyl</p>
      </div>
    </header>
  );
}
