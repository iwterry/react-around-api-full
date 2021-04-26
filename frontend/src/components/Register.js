import React from 'react';
import { Link } from 'react-router-dom';
import UserAuthForm from './UserAuthForm';

function Register(props) {
  const { onRegister, isRegistering, setUserIsOnRegistrationPage } = props;

  /*
    Since this component only renders on the when user is on registration endpoint, 
    this component will let the app know that it has mounted so that the Header
    component can display the correct information on the registration page
    (regardless of what URL for that endpoint is).
  */
  React.useEffect(() => {
    setUserIsOnRegistrationPage(true);
    return () => setUserIsOnRegistrationPage(false); // no longer on registration page
  }, []);

  const redirectionInfo = (
    <>
      Already a member? Log in {" "}
      <Link to="/signin" className="project-user-auth-form-container__link">
        here
      </Link>!
    </>
  );

  return (
    <UserAuthForm
      name="user-auth"
      title="Sign up"
      submitBtnText={isRegistering ? 'Signing up' : 'Sign up'}
      redirectionInfo={redirectionInfo}
      isProcessing={isRegistering}
      onUserAuth={onRegister}
    />
  );
}

export default Register;