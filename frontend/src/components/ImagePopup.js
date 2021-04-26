import React from 'react';
import Popup from './Popup';

function ImagePopup(props) {
  const { card, onClose } = props;

  return (
    <Popup 
      name="image-popup" 
      isOpen={card._id != null} 
      onClose={onClose} 
      additionalCssClassesStr="overlay_dark"
    >
      <figure className="image-popup">
        <img src={card.link} alt={card.name} className="image-popup__image" />
        <figcaption className="image-popup__title">{card.name}</figcaption>
      </figure>
    </Popup>
  );
}

export default ImagePopup;