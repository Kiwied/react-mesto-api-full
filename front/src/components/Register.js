import React from "react";
import { Link } from "react-router-dom";

export default function Register(props) {
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');

  function handleLoginRedirect() {
    props.onHeaderChange('login')
  }

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    props.onSubmit(password, email);
    setPassword('');
  }

  return (
    <main>
      <section className="auth">

        <form className="auth-form"
              onSubmit={handleSubmit}
        >
          <h2 className="auth-form__title">Регистрация</h2>
          <input
            type="email"
            placeholder="Email"
            className="auth-form__input"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="auth-form__input"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button type="submit"
                  className="auth-form__submit"
                  onClick={handleLoginRedirect}
          >
            Зарегистрироваться
          </button>
        </form>

        <p className="auth__redirect">
          Уже зарегистрированы? {<Link to="/signin"
                                       className="link"
                                       onClick={handleLoginRedirect}
        >
          Войти
        </Link>}
        </p>
      </section>
    </main>
  )
}
