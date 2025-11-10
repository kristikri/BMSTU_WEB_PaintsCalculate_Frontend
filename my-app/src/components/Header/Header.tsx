import './Header.css'
import logo from '../../assets/logo.png'

export default function Header() {
  return (
    <header>
        <a href="/"><img src={logo} alt="home" className="header-img" /></a>
    </header>
  );
}
