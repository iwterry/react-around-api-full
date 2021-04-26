import React from 'react';

import Popup from './Popup';

function InfoTooltip(props) {
  const { iconType, description, isOpen, onClose } = props;
  return (
    <Popup name="registration" isOpen={isOpen} onClose={onClose}>
      <div className="info-tooltip">
        <div className={`info-tooltip__icon info-tooltip__icon_type_${iconType}`}></div>
        <p className="info-tooltip__description">{description}</p>
      </div>
    </Popup>
  );
}

export default InfoTooltip;