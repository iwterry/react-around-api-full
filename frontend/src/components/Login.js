import React from 'react';
import { Link } from 'react-router-dom';
import UserAuthForm from './UserAuthForm';

function Login(props) {
  const { isLoggingIn, onLogin, setUserIsOnLoginPage } = props;

  /*
    Since this component only renders on the when user is on login endpoint, 
    this component will let the app know that it has mounted so that the Header
    component can display the correct information on the login page
    (regardless of what that URL for that endpoint is).
  */
  React.useEffect(() => {
    setUserIsOnLoginPage(true);
    return () => setUserIsOnLoginPage(false);
  }, []);

  const redirectionInfo = (
    <>
      Not a member yet? Sign up {" "}
      <Link to="/signup" className="project-user-auth-form-container__link">
        here
      </Link>!
    </>
  );

  return (
    <UserAuthForm
      name="user-auth"
      title="Log in"
      submitBtnText={isLoggingIn ? 'Logging in' : 'Log in'}
      isProcessing={isLoggingIn} 
      redirectionInfo={redirectionInfo}
      onUserAuth={onLogin}
    />
  );
}

export default Login;