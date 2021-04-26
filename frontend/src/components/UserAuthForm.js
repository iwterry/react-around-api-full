import React from 'react';
import { getInputErrors, getInputFieldErrorClassName } from '../utils/utils';
import Form from './Form';

function UserAuthForm(props) {
  const { 
    name, title, submitBtnText, onUserAuth, redirectionInfo, isProcessing
  } = props;

  const [ email, setEmail ] = React.useState('');
  const [ password, setPassword ] = React.useState('');
  const [ errors, setErrors ] = React.useState({});

  const fieldNames = {
    email: 'user-email',
    password: 'user-password'
  };
  const emailFieldErrorClassName = getInputFieldErrorClassName(
    errors, 
    fieldNames.email, 
    true
  );
  const passwordFieldErrorClassName = getInputFieldErrorClassName(
    errors,
    fieldNames.password, 
    true
  );

  const hasInvalidInput = Object.keys(errors).length > 0;

  const isSubmitBtnDisabled = (
    hasInvalidInput ||
    isProcessing ||
    email === '' || // necessary for when user has not entered a value for email
    password === ''  // or for password
  );
  const submitBtnClassName = `project-form__submit-btn project-form__submit-btn_type_${name}` + 
  (isSubmitBtnDisabled ? ' project-form__submit-btn_disabled' : '');

  
  function validateInput(inputElement) {
    setErrors(getInputErrors(errors, inputElement));
  }

  function handleUserEmailInputChange({ target: userEmailInputElement }) {
    setEmail(userEmailInputElement.value);
    validateInput(userEmailInputElement);
  }

  function handleUserPasswordInputChange({ target: userPasswordInputElement }) {
    setPassword(userPasswordInputElement.value);
    validateInput(userPasswordInputElement);
  }

  function handleBlur({ target }) {
    validateInput(target);
  }

  function handleUserAuth(evt) {
    evt.preventDefault();
    onUserAuth(email, password);
  }

  return (
    <main className="project-user-auth-form-container">
      <Form
        name={name}
        title={title}
        submitBtnText={submitBtnText}
        submitBtnClassName={submitBtnClassName}
        isSubmitBtnDisabled={isSubmitBtnDisabled}
        onSubmit={handleUserAuth}
      >
        <div className="project-form__field-wrapper project-form__field-wrapper_form_user-auth">
          <input 
            type="email"
            aria-label="Email"
            name={fieldNames.email}
            className={"project-form__input project-form__input_type_user-auth-field"}
            placeholder="Email"
            value={email}
            onChange={handleUserEmailInputChange}
            onBlur={handleBlur}
            required
          />
          <p className={emailFieldErrorClassName}>{errors[fieldNames.email]}</p>
        </div>
        <div className="project-form__field-wrapper project-form__field-wrapper_form_user-auth">
          <input
            type="password"
            aria-label="Password"
            name={fieldNames.password}
            className="project-form__input project-form__input_type_user-auth-field"
            placeholder="Password"
            value={password}
            onChange={handleUserPasswordInputChange}
            onBlur={handleBlur}
            required
          />
          <p className={passwordFieldErrorClassName}>{errors[fieldNames.password]}</p>
        </div>
      </Form>
      <p className="project-user-auth-form-container__redirection-info">
        {redirectionInfo}
      </p>
    </main>
  );
}

export default UserAuthForm;