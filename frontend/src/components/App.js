import React from 'react';
import { Switch, Route, useHistory, Redirect } from 'react-router-dom';

import CurrentUserContext from '../contexts/CurrentUserContext.js';

import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import ConfirmationPromptPopup from './ConfirmationPromptPopup.js';

import aroundApi from '../utils/aroundApi.js';
import { logErrors } from '../utils/utils.js';

import Register from './Register.js';
import InfoTooltip from './InfoTooltip.js';
import Login from './Login.js';
import ProtectedRoute from './ProtectedRoute.js';

function App() {
  const [ isEditProfilePopupOpen, setIsEditProfilePopupOpen ]  = React.useState(false);
  const [ isAddPlacePopupOpen, setIsAddPlacePopupOpen ] = React.useState(false);
  const [ isEditAvatarPopupOpen, setIsEditAvatarPopupOpen ] = React.useState(false);
  const [ selectedCard, setSelectedCard ] = React.useState({ _id: null, link: '#', name: '' });
  const [ currentUser, setCurrentUser ] = React.useState(null);
  const [ cards, setCards ] = React.useState([]);
  const [ idOfCardToBeDeleted, setIdOfCardToBeDeleted ] = React.useState(null);
  const [ isUpdatingAvatar, setIsUpdatingAvatar ] = React.useState(false);
  const [ isUpdatingProfile, setIsUpdatingProfile ] = React.useState(false);
  const [ isCreatingPlace, setIsCreatingPlace ] = React.useState(false);
  const [ isDeletingAfterConfirming, setIsDeletingAfterConfirming ] = React.useState(false);
  const [ isRegistrationError, setIsRegistrationError ] = React.useState(false);
  const [ isRegistrationSuccess, setIsRegistrationSuccess ] = React.useState(false);
  const [ isRegistering, setIsRegistering ] = React.useState(false);
  const [ isUserOnRegistrationPage, setIsUserOnRegistrationPage ] = React.useState(false);
  const [ isLoggingIn, setIsLoggingIn ] = React.useState(false);
  const [ isUserOnLoginPage, setIsUserOnLoginPage ] = React.useState(false);

  const isOpen = (
    isEditAvatarPopupOpen || 
    isEditProfilePopupOpen || 
    isAddPlacePopupOpen || 
    idOfCardToBeDeleted !== null || /* for confirmation popup */
    selectedCard._id !== null   ||  /* for image popup */
    isRegistrationSuccess ||
    isRegistrationError
  );
  const isLoggedIn = currentUser !== null;

  const history = useHistory();


  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIdOfCardToBeDeleted(null);
    setSelectedCard({ ...selectedCard, _id: null });
    setIsRegistrationError(false);
    setIsRegistrationSuccess(false);
  }

  function setInitDataForLoggedInUser() {
    aroundApi.getUserProfile()
      .then(setCurrentUser)
      .catch(logErrors);

    aroundApi.getInitialCards()
      .then(setCards)
      .catch(logErrors);
  }

  function handleClosingAllPopupsUsingEscKey(evt) {
    if(evt.key === 'Escape') {
      closeAllPopups();
    }
  }


  React.useEffect(() => { // using approach similar to earlier sprints
    if(isOpen) {
      document.addEventListener('keydown', handleClosingAllPopupsUsingEscKey);
    } else {
      document.removeEventListener('keydown', handleClosingAllPopupsUsingEscKey);
    }
  }, [isOpen]);

  React.useEffect(() => {
    aroundApi.checkIfUserIsLoggedIn()
      .then(({ jwt }) => {
        if(jwt) {
          aroundApi.setToken(jwt);
          setInitDataForLoggedInUser();
        }
      }).catch((logErrors));
  }, []);


  function handleCardLike(clickedCardId, isClickedCardLikedAlreadyByUser) {
    aroundApi.updateCardLikes(clickedCardId, !isClickedCardLikedAlreadyByUser)
      .then((updatedCard) => {
        const updatedCards = cards.map((card) => card._id === clickedCardId ? updatedCard : card);
        setCards(updatedCards);
      })
      .catch(logErrors);
  }

  function handleCardDelete(id) {
    setIdOfCardToBeDeleted(id);
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

  function handleCardSelect(cardId, cardName, cardLink) {
    setSelectedCard({
      _id: cardId,
      name: cardName, 
      link: cardLink
    });
  }

  function handleUpdateUser(name, about) {
    setIsUpdatingProfile(true);
    aroundApi.updateUserProfile(name, about)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch(logErrors)
      .finally(() =>  setIsUpdatingProfile(false));
  }

  function handleUpdateAvatar(avatar) {
    setIsUpdatingAvatar(true);
    aroundApi.updateUserAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch(logErrors)
      .finally(() => setIsUpdatingAvatar(false));
  }

  function handleAddPlace(name, link) {
    setIsCreatingPlace(true);
    aroundApi.createCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(logErrors)
      .finally(() => setIsCreatingPlace(false));
  }

  function handleConfirmation() {
    setIsDeletingAfterConfirming(true);
    aroundApi.deleteCard(idOfCardToBeDeleted)
      .then(() => {
        const updatedCards = cards.filter((aCard) => aCard._id !== idOfCardToBeDeleted);
        setCards(updatedCards);
        closeAllPopups();
      })
      .catch(logErrors)
      .finally(() => setIsDeletingAfterConfirming(false));
  }

  function handleRegisterClick(email, password) { 
    setIsRegistering(true);
    aroundApi.signup(email, password)
      .then(() => {
        setIsRegistrationSuccess(true);
        history.push('/signin');
      })
      .catch((err) => {
        logErrors(err);
        setIsRegistrationError(true);
      }).finally(() => setIsRegistering(false));
  }

  function handleLoginClick(email, password) {
    setIsLoggingIn(true);
    aroundApi.signin(email, password)
      .then(({ jwt }) => {
        aroundApi.setToken(jwt);
        setInitDataForLoggedInUser();
      })
      .catch((err) => {
        logErrors(err);
      }).finally(() => setIsLoggingIn(false));
  }

  function handleSignOut() {
    aroundApi.signout()
      .then(() => {
        setCurrentUser(null);
        history.push('/signin');
      }).catch(logErrors);
  }

  function redirectWhenUserIsLoggedIn(Component, props) {
    if(isLoggedIn) {
      return <Redirect to="/" /> 
    } else {
      return <Component {...props} />
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header 
          isUserLoggedIn={isLoggedIn} 
          userEmail={currentUser ? currentUser.email : ''}
          isUserOnLoginPage={isUserOnLoginPage}
          isUserOnRegistrationPage={isUserOnRegistrationPage}
          onSignOut={handleSignOut}
        />
        
        <Switch>
          {/* Logged in users should not be able to visit the login and registration routes. */}
          <Route path="/signin">
            {
              redirectWhenUserIsLoggedIn(Login, {
                onLogin: handleLoginClick, 
                isLoggingIn: isLoggingIn,
                setUserIsOnLoginPage: setIsUserOnLoginPage
              })
            }
          </Route>

          <Route path="/signup">
            {
              redirectWhenUserIsLoggedIn(Register, {
                onRegister: handleRegisterClick,
                isRegistering: isRegistering,
                setUserIsOnRegistrationPage: setIsUserOnRegistrationPage                
              })
            }
          </Route>

          {/* Users not logged in should only be able to login or register */}
          <ProtectedRoute 
            Component={Main}
            path="/"
            isLoggedIn={isLoggedIn}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardDelete={handleCardDelete} 
            onCardSelect={handleCardSelect}
            onCardLike={handleCardLike}
            cards={cards}
          />
        </Switch>
        <Footer />

        {/* 
          Since only certain components are relevant depending on whether the user 
          is logged in, there is little need to have irrelevant components be
          visible through devtools. Helps in security by limiting HTML manipulation.
        */}
        { isLoggedIn && (
          <>
            <EditProfilePopup 
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups} 
              onUpdateUser={handleUpdateUser} 
              isUpdatingProfile={isUpdatingProfile} 
            />

            <AddPlacePopup 
              isOpen={isAddPlacePopupOpen} 
              onClose={closeAllPopups} 
              onAddPlace={handleAddPlace} 
              isCreatingPlace={isCreatingPlace} 
            />

            <ConfirmationPromptPopup 
              isOpen={idOfCardToBeDeleted !== null} 
              onClose={closeAllPopups} 
              onConfirmation={handleConfirmation} 
              isDeletingAfterConfirming={isDeletingAfterConfirming} 
            />
              
            <EditAvatarPopup 
              isOpen={isEditAvatarPopupOpen} 
              onClose={closeAllPopups} 
              onUpdateAvatar={handleUpdateAvatar} 
              isUpdatingAvatar={isUpdatingAvatar} 
            />

            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          </>
        )}


        <InfoTooltip 
          iconType="success" 
          description="Success! You have now been registered."
          isOpen={isRegistrationSuccess}
          onClose={closeAllPopups}
        />
        <InfoTooltip 
          iconType="error" 
          description="Oops, something went wrong! Please try again."
          isOpen={isRegistrationError}
          onClose={closeAllPopups}
        />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
/*
  Note:
  - All popups can be closed using close button, ESC key, and clicking on overlay (and not 
    its contents)
  - forms operate as follows
    - submit button is disabled when having invalid inputs, submitting, and closing  form popups
    - input errors are shown when inputs are invalid and are hidden when closing the form popups
      and shown when opening
    - when closing form popup, input fields are not reset, but they cleared when 
      submitting (except for profile form to update user name and description)
    - text change on submit button to show the user that information is being saved (except
      when deleting cards)
    - when deleting card, the user is asked to confirm first.
*/