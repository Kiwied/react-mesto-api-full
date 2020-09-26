import React from 'react';
import '../index.css';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import Login from "./Login";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import { api } from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import AddPlacePopup from "./AddPlacePopup";
import { Route, Switch, withRouter, useHistory } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import { HeaderContext, headers } from "../contexts/HeaderContext";
import { InfoTooltipContext, infoTooltipCaptions } from "../contexts/infoTooltipContext";
import { auth } from "../utils/Auth";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [headerContext, setHeaderContext] = React.useState('login');
  const [infoTooltipContext, setInfoTooltipContext] = React.useState('fail');
  const [email, setEmail] = React.useState('');

  const history = useHistory();

  React.useEffect(() => {
    api.getUserInfo()
      .then(res => {
        setCurrentUser(res);
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`);
      })
  }, [])

  function overlayCloseEffect(popupName) {
    function handleOverlayClose(evt) {
      if (evt.target.classList.contains('popup_opened')) {
        closeAllPopups();
      }
    }

    document
      .getElementById(`popup__${popupName}`)
      .addEventListener('click', handleOverlayClose)

    return() => {
      document
        .getElementById(`popup__${popupName}`)
        .removeEventListener('click', handleOverlayClose)
    }
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  }

  function handleInfoTooltipOpen() {
    setIsInfoTooltipOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({});
  }

  function handleUpdateUser(newUserInfo) {
    api.setNewUserInfo(newUserInfo)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`)
      });
  }

  function handleUpdateAvatar({avatar}) {
    api.setNewAvatar({avatar})
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`)
      });
  }

  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {
    api.getInitialCards()
      .then(res => {
        setCards(res);
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`)
      });
  }, [])

  React.useEffect(() => {
    function tokenCheck() {
      const jwt = localStorage.getItem('token');
      if (jwt) {
        auth.getContent(jwt)
          .then(res => {
            if (res) {
              handleLogin();
              setEmail(res.data.email);
              history.push('/');
            }
          })
          .catch(err => console.log(err))
      }
    }

      tokenCheck();
  }, [loggedIn, history])



  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    (isLiked ? api.dislike(card._id) : api.like(card._id))
      .then((likedCard) => {
        const newCards = cards.map((currentCard) =>
          currentCard._id === card._id ? likedCard : currentCard
        );
        setCards(newCards);
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`)
      });
  }

  function handleCardDelete(card) {
    api.delete(card._id)
      .then(() => {
        const newCards = cards.filter(currentCard =>
          currentCard._id !== card._id
        );
        setCards(newCards);
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`)
      });
  }

  function handleAddPlaceSubmit(newCardInfo) {
    api.addNewCard(newCardInfo)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`)
      });
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogout() {
    setLoggedIn(false);
  }

  function handleBtnSignOut() {
    handleLogout();
    localStorage.removeItem('token');
    history.push('/signin');
  }

  function handleLoginFormSubmit(password, email) {
    auth.singIn(password, email)
      .then(data => {
        if (data.token) {
          handleLogin();
          history.push('/');
        }
      })
      .catch(() => {
        setInfoTooltipContext('fail');
        handleInfoTooltipOpen();
      })
  }

  function handleRegisterFormSubmit(password, email) {
    auth.register(password, email)
      .then(res => {
        if (res) {
          setInfoTooltipContext('success');
          history.push('/signin');
        } else {
          setInfoTooltipContext('fail');
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        handleInfoTooltipOpen();
      })
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="content">
          <HeaderContext.Provider value={headers[headerContext]}>
            <Header loggedIn={loggedIn}
                    email={email}
                    onSignOut={handleBtnSignOut}
                    onHeaderChange={setHeaderContext}
            />
          </HeaderContext.Provider>

          <Switch>
            <Route path="/signup">
              <Register onHeaderChange={setHeaderContext}
                        onSubmit={handleRegisterFormSubmit}
              />
            </Route>

            <Route path="/signin">
              <Login onHeaderChange={setHeaderContext}
                     onSubmit={handleLoginFormSubmit}
              />
            </Route>

            <ProtectedRoute path="/"
                            loggedIn={loggedIn}
                            component={Main}
                            onEditProfile={handleEditProfileClick}
                            onAddPlace={handleAddPlaceClick}
                            onEditAvatar={handleEditAvatarClick}
                            onCardClick={handleCardClick}
                            cards={cards}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
            />
          </Switch>

          {loggedIn && <Footer/>}

          <InfoTooltipContext.Provider value={infoTooltipCaptions[infoTooltipContext]}>
            <InfoTooltip
              isOpen={isInfoTooltipOpen}
              onClose={closeAllPopups}
              loggedIn={loggedIn}
              overlayCloseEffect={overlayCloseEffect}
            />
          </InfoTooltipContext.Provider>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            overlayCloseEffect={overlayCloseEffect}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            overlayCloseEffect={overlayCloseEffect}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onAvatarUpdate={handleUpdateAvatar}
            overlayCloseEffect={overlayCloseEffect}
          />

          <ImagePopup
            isOpen={isImagePopupOpen}
            onClose={closeAllPopups}
            card={selectedCard}
            overlayCloseEffect={overlayCloseEffect}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
