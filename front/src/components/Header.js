import logoPath from "../images/logo.svg";
import React from "react";
import { Link } from 'react-router-dom';
import { HeaderContext } from "../contexts/HeaderContext";

export default function Header(props) {
  const headerContext = React.useContext(HeaderContext);

  function handleLinkClick() {
    if (headerContext.text === 'Войти') {
      props.onHeaderChange('login')
    }
    if (headerContext.text === 'Регистрация') {
      props.onHeaderChange('register')
    }
    console.log(headerContext);
  }

  return (
      <header className="header">
          <img src={logoPath}
               alt="Логотип сервиса Mesto"
               className="header__logo"
          />

          <div className="header__container">
            <p className="header__auth">
              { props.loggedIn
                ? (`${props.email}  `)
                : (
                  <Link to={headerContext.redirectPath}
                        className="link"
                        onClick={handleLinkClick}
                  >
                    {headerContext.text}
                  </Link>
                )
              }
            </p>
            {props.loggedIn && <Link to=""
                                     className="link link_header"
                                     onClick={props.onSignOut}
            >
              Выйти
            </Link>}
          </div>
      </header>
  )
}
