import PopupWithForm from "./PopupWithForm";
import React from "react";

export default function EditAvatarPopup(props) {
  const urlRef = React.useRef();

  React.useEffect(() => {
    urlRef.current.value = '';
  }, [props.isOpen])

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onAvatarUpdate({
      avatar: urlRef.current.value,
    })
  }

  function handleClose() {
    props.onClose();
  }

  return (
    <PopupWithForm
      isOpen={props.isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      overlayCloseEffect={props.overlayCloseEffect}
      name="avatar"
      title="Обновить аватар"
      button="Сохранить"
      children={(
        <>
          <input type="url"
                 id="avatar-link-input"
                 name="avatar"
                 ref={urlRef}
                 placeholder="Ссылка на картинку"
                 className="form__input form__input_link"
                 required
          />
          <span className="form__input-error"
                id="avatar-link-input-error">
          </span>
        </>
      )}
    />
  )
}
