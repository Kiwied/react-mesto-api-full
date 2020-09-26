import React from "react";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

export default function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = props.card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = `element__delete ${
    isOwn ? '' : 'element__delete_hidden'}`;


  const isLiked = props.card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = `element__like ${
    isLiked ? 'element__like_active' : ''}`;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleCardDelete() {
    props.onCardDelete(props.card);
  }

  return(
      <li className="element">
        <img className="element__image"
             onClick={handleClick}
             src={props.card.link}
             alt={`Фото ${props.card.name}`}
        />
        <div className="element__сaption">
          <h3 className="element__title">{props.card.name}</h3>
          <div className="element__likes">
            <button type="button"
                    className={cardLikeButtonClassName}
                    onClick={handleLikeClick}
            />
            <p className="element__like-counter">{props.card.likes.length}</p>
          </div>
        </div>
        <button type="button"
                className={cardDeleteButtonClassName}
                onClick={handleCardDelete}
        />
      </li>
  )
}
