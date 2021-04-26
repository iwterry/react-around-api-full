import React from 'react';

function Form(props) {
  const { name, title, submitBtnClassName, isSubmitBtnDisabled, submitBtnText, onSubmit, children } = props;

  return (
    <form 
      name={name} 
      className={`project-form project-form_type_${name}`} 
      onSubmit={onSubmit} 
      noValidate
    > 
      <h3 className={`project-form__title project-form__title_type_${name}`}>
        {title}
      </h3>
      {children}
      <button type="submit" className={submitBtnClassName} disabled={isSubmitBtnDisabled}>
        {submitBtnText || 'Submit'}
      </button>
    </form>
  );
}

export default Form;