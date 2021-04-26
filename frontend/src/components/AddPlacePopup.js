import React from 'react';
import { getInputErrors, getInputFieldErrorClassName } from '../utils/utils';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
  const { isOpen, onClose, onAddPlace, isCreatingPlace } = props;

  const [ title, setTitle ] = React.useState('');
  const [ link, setLink ] = React.useState(''); 
  const [ errors, setErrors ] = React.useState({});

  React.useEffect(() => {
    setTitle('');
    setLink('');
    setErrors({});
  }, [isOpen]);


  const fieldNames = {
    placeTitle: 'location-title',
    placeLink: 'location-link'
  }

  const fieldErrorClassNames = Object.keys(fieldNames).reduce((errorClassNames, key) => {
    const errorClassName = getInputFieldErrorClassName(
      errors, 
      fieldNames[key], 
      isOpen
    );

    errorClassNames[key] = errorClassName;
    return errorClassNames;
  }, {});

  const hasInvalidInput = Object.keys(errors).length > 0;

  const isSubmitBtnDisabled = (
    title === '' || // when user has not changed title input
    link === '' || // or link input
    isCreatingPlace ||
    hasInvalidInput || 
    !isOpen
  );

  
  function handleSubmit(evt) {
    evt.preventDefault();

    onAddPlace(title, link);
  }

  function validateInput(inputElement) {
    setErrors(getInputErrors(errors, inputElement));
  }

  function handleTitleInputChange({ target: titleInputElement }) {
    setTitle(titleInputElement.value);
    validateInput(titleInputElement);
  }

  function handleLinkInputChange({ target: linkInputElement }) {
    setLink(linkInputElement.value);
    validateInput(linkInputElement);
  }

  function handleBlur({ target: inputElement }) {
    validateInput(inputElement);
  }


  return (
    <PopupWithForm 
      name="location-create" 
      title="New place" 
      isOpen={isOpen} 
      onClose={onClose} 
      onSubmit={handleSubmit} 
      isSubmitBtnDisabled={isSubmitBtnDisabled}
      submitBtnText={isCreatingPlace ? 'Saving' : 'Save'}
    >
      <div className="project-form__field-wrapper project-form__field-wrapper_form_location-create">
        <input 
          type="text"
          aria-label="Title"
          name={fieldNames.placeTitle}
          className="project-form__input project-form__input_type_location-create-field"
          placeholder="Title"
          minLength="2"
          maxLength="30"
          value={title}
          onChange={handleTitleInputChange}
          onBlur={handleBlur}
          required
        />
        <p className={fieldErrorClassNames.placeTitle}>{errors[fieldNames.placeTitle]}</p>
      </div>
      <div className="project-form__field-wrapper project-form__field-wrapper_form_location-create">
        <input
          type="url"
          aria-label="Image link"
          name={fieldNames.placeLink}
          className="project-form__input project-form__input_type_location-create-field"
          placeholder="Image link"
          value={link}
          onChange={handleLinkInputChange}
          onBlur={handleBlur}
          required
        />
        <p className={fieldErrorClassNames.placeLink}>{errors[fieldNames.placeLink]}</p>
      </div>
    </PopupWithForm>
  );
}

export default AddPlacePopup;