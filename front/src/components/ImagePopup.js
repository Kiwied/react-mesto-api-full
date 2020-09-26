import React from "react";

export default function ImagePopup(props) {
  React.useEffect(() => {
    props.overlayCloseEffect('enlarged')
  }, [])

  return (
      <section className={`popup ${props.isOpen && 'popup_opened'}`}
               id="popup__enlarged">
        <div className="popup__enlarged">
          <img className="popup__image"
               src={props.card.link}
               alt={props.card.name}/>
          <p className="popup__place">{props.card.name}</p>
          <button type="button"
                  className="popup__close"
                  onClick={props.onClose}
          >
          </button>
        </div>
      </section>
  )
}
