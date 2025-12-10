import { type MouseEvent } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/logo.png'
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store';
import { logoutUser } from '../../store/slices/userSlice';
import { ROUTES } from '../../Routes';

export default function Header() {
  const handleBurgerClick = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.classList.toggle('active');
  };
  
  const { isAuthenticated, username, is_moderator } = useSelector((state: RootState) => state.user);
  const { paints_count } = useSelector((state: RootState) => state.calculate);
  const dispatch = useDispatch<AppDispatch>();

  const handleMenuClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="header">
        <div className="header__logo">
          <NavLink to={ROUTES.HOME} className="header__logo-link">
            <img src={logo} alt="Logo" />
          </NavLink>
        </div>

        <nav className="header__nav">
          <NavLink to={ROUTES.HOME} className="header__link">
            Главная
          </NavLink>
          <NavLink to={ROUTES.PAINTS} className="header__link">
            Краски
          </NavLink>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <NavLink to={ROUTES.CALCULATES} className="header__link">
                Мои расчеты
                {paints_count > 0 && (
                  <span className="cart-badge">{paints_count}</span>
                )}
              </NavLink>
              <NavLink to={ROUTES.PROFILE} className="header__link">
                Профиль
              </NavLink>
              <span className="username">{username}</span>
                {is_moderator && (
                  <NavLink to={ROUTES.MODERATOR} className="header__link">
                    Модератор
                  </NavLink>
                )}
              <Link to={ROUTES.HOME} className="header__link logout-btn" onClick={handleLogout}>
                Выйти
              </Link>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="header__link">
                Войти
              </NavLink>
              <NavLink to="/register" className="header__link">
                Регистрация
              </NavLink>
            </>
          )}
        </nav>

        <div className="header__mobile-wrapper" onClick={handleBurgerClick}>
          <div className="header__mobile-target" />
          <div className="header__mobile-menu" onClick={handleMenuClick}>
            <NavLink to={ROUTES.HOME} className="header__link">
              Главная
            </NavLink>
            <NavLink to={ROUTES.PAINTS} className="header__link">
              Краски
            </NavLink>
            
            {isAuthenticated ? (
              <div className="user-menu-mobile">
                <NavLink to={ROUTES.CALCULATES} className="header__link">
                  Мои расчеты
                  {paints_count > 0 && (
                    <span className="cart-badge">{paints_count}</span>
                  )}
                </NavLink>
                {is_moderator && (
                  <NavLink to={ROUTES.MODERATOR} className="header__link">
                    Модератор
                  </NavLink>
                )}
                <NavLink to={ROUTES.PROFILE} className="header__link">
                  Профиль
                </NavLink>
                <div className="mobile-user-info">
                  <span className="username">Пользователь: {username}</span>
                </div>
                <NavLink to={ROUTES.HOME} className="header__link logout-btn" onClick={handleLogout}>
                  Выйти
                </NavLink>
              </div>
            ) : (
              <>
                <NavLink to="/login" className="header__link">
                  Войти
                </NavLink>
                <NavLink to="/register" className="header__link">
                  Регистрация
                </NavLink>
              </>
            )}
          </div>
        </div>
    </header>
  );
};