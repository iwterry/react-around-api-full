import React from 'react';
import { Link } from 'react-router-dom';

function Nav(props) {
  const { 
    isHamburgerMenuShown, 
    isUserLoggedIn, 
    isCloseBtnShown, 
    userEmail, 
    onSignOut, 
    isUserOnRegistrationPage, 
    isUserOnLoginPage
  } = props;
  return (
    <nav className={`nav ${isHamburgerMenuShown ? 'nav_logged-in-mobile-inactive' : ''}`}>
      <ul className="nav__items">
        <li className={`nav__item ${isUserLoggedIn ? 'nav__item_active' : ''} ${isCloseBtnShown ? 'nav__item_logged-in-mobile': ''}`}>
          <p className="nav__user-detail">{userEmail}</p>
          <Link to="#" className="nav__link" onClick={onSignOut}>Log out</Link>
        </li>
        <li className={`nav__item ${!isUserLoggedIn && isUserOnRegistrationPage ? 'nav__item_active' : ''}`}>
          <Link to="/signin" className="nav__link">Log in</Link>
        </li>
        <li className={`nav__item ${!isUserLoggedIn && isUserOnLoginPage ? 'nav__item_active' : ''}`}>
          <Link to="/signup" className="nav__link">Sign up</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;