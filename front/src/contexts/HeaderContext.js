import React from "react";

export const HeaderContext = React.createContext();

export const headers = {
  register: {
    text: 'Войти',
    redirectPath: '/signin'
  },
  login: {
    text: 'Регистрация',
    redirectPath: '/signup'
  }
}
