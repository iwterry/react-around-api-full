import React from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';

function Card(props) {
  const { card, onCardSelect, onCardLike, onCardDelete } = props;
  const currentUser = React.useContext(CurrentUserContext);

  const numLikes = card.likes.length;
  const isCurrentUserTheOwnerOfCard = card.owner._id === currentUser._id;
  const isCardLikedByCurrentUser = card.likes.some((someUser) => someUser._id === currentUser._id);

  const deleteBtnClassName = 'location__delete-btn' + 
    (isCurrentUserTheOwnerOfCard ? ' location__delete-btn_active' : '');
  const likeBtnClassName = 'location__like-btn' +
    (isCardLikedByCurrentUser ? ' location__like-btn_active' : '');


  function handleCardImageClick() {
    onCardSelect(card._id, card.name, card.link);
  }

  function handleLikeBtnClick() {
    onCardLike(card._id, isCardLikedByCurrentUser);
  }

  function handleDeleteBtnClick() {
    onCardDelete(card._id)
  }
  

  return (
    <li className="location">
      <button 
        type="button"
        aria-label="Delete"
        className={deleteBtnClassName}
        onClick={handleDeleteBtnClick}
      ></button>
      <img
        src={card.link} 
        alt={card.name} 
        className="location__image" 
        onClick={handleCardImageClick}
      />
      <div className="location__content-wrapper">
        <h2 className="location__name">{card.name}</h2>
        <div className="location__likes-wrapper">
          <button 
            type="button" 
            aria-label="Like" 
            className={likeBtnClassName}
            onClick={handleLikeBtnClick}
          ></button>
          <p className="location__num-likes">{numLikes}</p>
        </div>
      </div>
    </li>
  );
}

export default Card;