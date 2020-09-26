import React from "react";
import Card from "./Card.js";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

export default function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile">
        <div className="profile__main">
          <div className="profile__avatar-container"
               onClick={props.onEditAvatar}>
            <img
              alt="Аватар профиля"
              className="profile__avatar"
              src={currentUser.avatar}
            />
            <div className="profile__avatar_overlay"/>
          </div>
          <div className="profile__info">
            <div className="profile__row">
              <h2 className="profile__name">{currentUser.name}</h2>
              <button
                onClick={props.onEditProfile}
                type="button"
                className="profile__edit">
              </button>
            </div>
            <p className="profile__description">{currentUser.about}</p>
          </div>
        </div>
        <button
          onClick={props.onAddPlace}
          type="button"
          className="profile__add">
        </button>
      </section>

      <section>
        <ul className="elements">
          {props.cards.map(currentCard => (
            <Card
              card={currentCard}
              key={currentCard._id}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  )
}
