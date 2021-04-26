export function logErrors(err) {
  console.log(`Error: ${err}`);
}

export function getInputErrors(errors, inputElement) {
  const errs = { ...errors };

  if (!inputElement.validity.valid) {
    errs[inputElement.name] = inputElement.validationMessage;
  } else {
    delete errs[inputElement.name];
  }
  return errs;
}

export function getInputFieldErrorClassName(fieldErrors, fieldName, isErrorShown) {
  const inputErrorBlockElement = 'project-form__input-error';
  
  const fieldErrorClassName = inputErrorBlockElement +
    ` ${inputErrorBlockElement}_field_${fieldName}` +
    (fieldErrors[fieldName] != null && isErrorShown ? ` ${inputErrorBlockElement}_active` : '');

  return fieldErrorClassName;
}
