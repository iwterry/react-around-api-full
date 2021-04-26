import React from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext.js';

import Card from './Card.js';

function Main(props) {
  const { 
    onEditAvatar, 
    onAddPlace, 
    onEditProfile, 
    onCardSelect, 
    onCardLike, 
    onCardDelete, 
    cards 
  } = props;
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="main-content">
      <section className="profile">
        <div className="profile__avatar-wrapper">
          <img src={currentUser.avatar} alt="profile avatar" className="profile__avatar" />
          <div className="profile__avatar-overlay" onClick={onEditAvatar}></div>
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button type="button" aria-label="Edit" className="profile__edit-btn" onClick={onEditProfile}></button>
          <p className="profile__self-description">{currentUser.about}</p>
        </div>
        <button type="button" aria-label="Add location" className="profile__add-btn" onClick={onAddPlace}></button>
      </section>

      <section className="locations">
        <ul className="locations__collection">
        {cards.map(({ name, link, likes, _id, owner }) => { 
          return (
            <Card
              key={_id}
              card={{ name, link, likes, _id, owner }}
              onCardSelect={onCardSelect}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete} 
            />
          );
        })}
        </ul>
      </section>
    </main>
  );
}

export default Main;