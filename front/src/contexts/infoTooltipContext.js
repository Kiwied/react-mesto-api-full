import React from "react";
import okPath from '../images/icon-ok.svg';
import failPath from '../images/icon-cross.svg';

export const InfoTooltipContext = React.createContext();

export const infoTooltipCaptions = {
  success: {
    text: 'Вы успешно зарегистрировались!',
    imgPath: okPath
  },
  fail: {
    text: 'Что-то пошло не так!\n' +
      'Попробуйте ещё раз.',
    imgPath: failPath
  }
}
