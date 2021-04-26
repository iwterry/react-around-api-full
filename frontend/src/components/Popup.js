import React from 'react';

function Popup(props) {
  const { name, children, isOpen, onClose, additionalCssClassesStr='' } = props;

  const OPENED_OVERLAY_CSS_CLASS = 'overlay_opened';

  function handleClick({ target }) { 
    // closing popup by clicking on just the overlay and not its contents
    if(target.classList.contains(OPENED_OVERLAY_CSS_CLASS)) onClose();
  }

  return (
    <div 
      className={`overlay ${additionalCssClassesStr} ${isOpen ? OPENED_OVERLAY_CSS_CLASS : ''}`} 
      onClick={handleClick}
    >
      <div className="overlay__wrapper">
        <button
          type="button"
          aria-label="Close"
          className={`overlay__close-btn overlay__close-btn_type_${name}`}
          onClick={onClose}
        >
        </button>
        {children}
      </div>
    </div>
  );
}

export default Popup;