import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store';
import { registerUser } from '../store/slices/userSlice';
import Header from '../components/Header/Header';
import './RegistrationPage.css';

export default function RegistrationPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.user);
  
  const [form, setForm] = useState({
    login: '',
    password: '',
    confirmPassword: ''
  });

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!form.login || !form.password || !form.confirmPassword) {
      setValidationError('Все поля обязательны для заполнения');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setValidationError('Пароли не совпадают');
      return;
    }

    if (form.password.length < 6) {
      setValidationError('Пароль должен быть не менее 6 символов');
      return;
    }

    try {
      await dispatch(registerUser({ 
        login: form.login, 
        password: form.password 
      })).unwrap();
      navigate('/paints'); // Перенаправляем на страницу с красками
    } catch (error) {
      // Ошибка уже обрабатывается в slice
    }
  };

  return (
    <div className="registration-page">
      <Header />
      
      <div className="registration-container">
        <div className="registration-form-wrapper">
          <h1>Регистрация</h1>
          
          {(error || validationError) && (
            <div className="error-message">
              {error || validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="login">Логин</label>
              <input
                type="text"
                id="login"
                value={form.login}
                onChange={(e) => setForm({...form, login: e.target.value})}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль (минимум 6 символов)</label>
              <input
                type="password"
                id="password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input
                type="password"
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="registration-button"
              disabled={loading || !form.login || !form.password || !form.confirmPassword}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="registration-links">
            <p>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}