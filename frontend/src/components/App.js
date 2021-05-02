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
  const [ isError, setIsError ] = React.useState(false);
  const [ errText, setErrText ] = React.useState('');
  const [ isRegistrationSuccess, setIsRegistrationSuccess ] = React.useState(false);
  const [ isRegistering, setIsRegistering ] = React.useState(false);
  const [ isUserOnRegistrationPage, setIsUserOnRegistrationPage ] = React.useState(false);
  const [ isLoggingIn, setIsLoggingIn ] = React.useState(false);
  const [ isUserOnLoginPage, setIsUserOnLoginPage ] = React.useState(false);
  const history = useHistory();

  const isOpen = (
    isEditAvatarPopupOpen || 
    isEditProfilePopupOpen || 
    isAddPlacePopupOpen || 
    idOfCardToBeDeleted !== null || /* for confirmation popup */
    selectedCard._id !== null   ||  /* for image popup */
    isRegistrationSuccess ||
    isError
  );
  const isLoggedIn = currentUser !== null;


  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIdOfCardToBeDeleted(null);
    setSelectedCard({ ...selectedCard, _id: null });
    setIsError(false);
    setIsRegistrationSuccess(false);
  }

  function handleError(httpStatusCode, description='') {
    logErrors(httpStatusCode);
    setIsError(true);

    if(description) {
      setErrText(description);
      return;
    }

    switch(httpStatusCode) {
      case 400:
      case 401:
        setErrText('The information provided was incorrect. Please try again.');
        break;
      case 403:
        setErrText('You do not have permission to perform this action.');
        break;
      default: // handles 404 (which should not occur) and 500 errors
        setErrText('Oops, something went wrong! Please try again.');
    }
  } 

  function setInitDataForLoggedInUser() {
    aroundApi.getUserProfile()
      .then(setCurrentUser)
      .catch(handleError);

    aroundApi.getInitialCards()
      .then(setCards)
      .catch(handleError);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // only should run when isOpen changes

  React.useEffect(() => {
    aroundApi.checkIfUserIsLoggedIn()
      .then(({ jwt }) => {
        if(jwt) {
          aroundApi.setToken(jwt);
          setInitDataForLoggedInUser();
        }
      }).catch(handleError);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only should run once and that is when app mounts


  function handleCardLike(clickedCardId, isClickedCardLikedAlreadyByUser) {
    aroundApi.updateCardLikes(clickedCardId, !isClickedCardLikedAlreadyByUser)
      .then((updatedCard) => {
        const updatedCards = cards.map((card) => card._id === clickedCardId ? updatedCard : card);
        setCards(updatedCards);
      })
      .catch(handleError);
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
      .catch(handleError)
      .finally(() =>  setIsUpdatingProfile(false));
  }

  function handleUpdateAvatar(avatar) {
    setIsUpdatingAvatar(true);
    aroundApi.updateUserAvatar(avatar)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch(handleError)
      .finally(() => setIsUpdatingAvatar(false));
  }

  function handleAddPlace(name, link) {
    setIsCreatingPlace(true);
    aroundApi.createCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(handleError)
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
      .catch(handleError)
      .finally(() => setIsDeletingAfterConfirming(false));
  }

  function handleRegisterClick(email, password) { 
    setIsRegistering(true);
    aroundApi.signup(email, password)
      .then(() => {
        setIsRegistrationSuccess(true);
        history.push('/signin');
      })
      .catch((httpStatusCode) => {
        if(httpStatusCode === 409) handleError(httpStatusCode, 'Must choose a different email address');
        else handleError(httpStatusCode);
      }).finally(() => setIsRegistering(false));
  }

  function handleLoginClick(email, password) {
    setIsLoggingIn(true);
    aroundApi.signin(email, password)
      .then(({ jwt }) => {
        aroundApi.setToken(jwt);
        setInitDataForLoggedInUser();
      })
      .catch(handleError)
      .finally(() => setIsLoggingIn(false));
  }

  function handleSignOut() {
    aroundApi.signout()
      .then(() => {
        setCurrentUser(null);
        history.push('/signin');
      }).catch(handleError);
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
        {/* 
          Changed the error InfoTooltip from just showing up when registration error 
          occurs to displaying more errors from the app in order to provide better usability.
      */}
        <InfoTooltip 
          iconType="error" 
          description={errText}
          isOpen={isError}
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