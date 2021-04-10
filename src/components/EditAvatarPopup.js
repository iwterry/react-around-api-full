import React from 'react';
import PopupWithForm from './PopupWithForm';

import { getInputErrors, getInputFieldErrorClassName } from '../utils/utils';

function EditAvatarPopup(props) {
  const { isOpen, onClose, onUpdateAvatar, isUpdatingAvatar } = props;
  
  const [ avatar, setAvatar ] = React.useState('');
  const [ error, setError ] = React.useState({});
  const [ hasUserChangedInput, setHasUserChangedInput ] = React.useState(false);

  const PROFILE_AVATAR_FIELD_NAME = 'profile-avatar';
  const avatarFieldErrorClassName = getInputFieldErrorClassName(
    error, 
    PROFILE_AVATAR_FIELD_NAME, 
    isOpen
  );
  const hasInvalidInput = error.hasOwnProperty(PROFILE_AVATAR_FIELD_NAME);
  const isSubmitBtnDisabled = (
    !hasUserChangedInput || 
    isUpdatingAvatar || 
    hasInvalidInput || 
    !isOpen
  );
console.log('rendered');

  function handleSubmit(evt) {
    evt.preventDefault();
  
    onUpdateAvatar(avatar);
    setAvatar('');
  }

  function validateInput(inputElement) {
    setError(getInputErrors(error, inputElement));
    setAvatar(inputElement.value);
  }

  function handleInputChange({ target: avatarInputElement }) {
    setAvatar(avatarInputElement.value);
    validateInput(avatarInputElement);

    setHasUserChangedInput(true);
  }

  function handleBlur({ target: inputElement }) {
    validateInput(inputElement);
  }
      
  return (
    <PopupWithForm 
      name="profile-img-change" 
      title="Change profile picture" 
      isOpen={isOpen} 
      onClose={onClose} 
      onSubmit={handleSubmit}
      isSubmitBtnDisabled={isSubmitBtnDisabled}
      submitBtnText={isUpdatingAvatar ? 'Saving' : 'Save'}
    >
      <div className="project-form__field-wrapper project-form__field-wrapper_form_profile-img-change">
        <input
          type="url"
          aria-label="Avatar link"
          name={PROFILE_AVATAR_FIELD_NAME}
          className="project-form__input project-form__input_type_profile-img-change-field"
          placeholder="Avatar link"
          value={avatar}
          onChange={handleInputChange}
          onBlur={handleBlur}
          required
        />
        <p className={avatarFieldErrorClassName}>{error[PROFILE_AVATAR_FIELD_NAME]}</p>
      </div>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;