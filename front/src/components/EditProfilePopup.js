import PopupWithForm from "./PopupWithForm";
import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function EditProfilePopup(props) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleDescriptionChange(evt) {
    setDescription(evt.target.value);
  }


  function handleSubmit(evt) {
    evt.preventDefault();

    props.onUpdateUser({
      name: name,
      about: description
    });
  }

  return(
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      overlayCloseEffect={props.overlayCloseEffect}
      name="profile"
      title="Редактировать профиль"
      button="Сохранить"
      children={(
        <>
          <input
            type="text"
            id="name-input"
            name="name"
            placeholder="Имя"
            value={name || ''}
            onChange={handleNameChange}
            className="form__input form__input_name"
            minLength="2" maxLength="40"
            pattern="^[A-Za-zА-Яа-яЁё \-]+$"
            required
          />
          <span className="form__input-error"
                id="name-input-error">
          </span>
          <input
            type="text"
            id="description-input"
            name="about"
            placeholder="Описание"
            value={description || ''}
            onChange={handleDescriptionChange}
            className="form__input form__input_description"
            minLength="2" maxLength="200"
            pattern="^[A-Za-zА-Яа-яЁё, \-]+$"
            required
          />
          <span className="form__input-error"
                id="description-input-error">
          </span>
        </>
      )}
    />
  )
}
