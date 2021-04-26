import React from 'react';
import Form from './Form';
import Popup from './Popup';

function PopupWithForm(props) {
  const { 
    name, title, children, isOpen, onClose, 
    onSubmit, isSubmitBtnDisabled, submitBtnText
  } = props;

  const submitBtnClassName = `project-form__submit-btn project-form__submit-btn_type_${name}` + 
    (isSubmitBtnDisabled ? ' project-form__submit-btn_disabled' : '');

  return (
    <Popup name={name} isOpen={isOpen} onClose={onClose}>
      <Form
        name={name}
        title={title}
        submitBtnText={submitBtnText}
        submitBtnClassName={submitBtnClassName}
        isSubmitBtnDisabled={isSubmitBtnDisabled}
        onSubmit={onSubmit} 
      > 
        {children}
      </Form>
    </Popup>
  );
}

export default PopupWithForm;