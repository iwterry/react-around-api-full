import React from 'react';

import logo from '../images/header-vector.svg';
import Nav from './Nav';

function Header(props) {
  const { isUserLoggedIn, ...otherProps } = props;
  const [ isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  const isHamburgerMenuShown = !isMobileNavOpen && isUserLoggedIn;
  const isCloseBtnShown = isMobileNavOpen && isUserLoggedIn;

  function handleToggleMobileNav() {
    setIsMobileNavOpen(!isMobileNavOpen);
  }

  return (
    <header className={`header ${isUserLoggedIn ? 'header_logged-in-mobile' : ''}`}>
      <div className={`header__wrapper ${isUserLoggedIn ? 'header__wrapper_logged-in-mobile' : ''}`}>
        <img src={logo} alt="Around The U.S." className="header__vector" />
        <div 
          className={`header__hamburger-menu ${isHamburgerMenuShown ? 'header__hamburger-menu_active' : ''}`} 
          onClick={handleToggleMobileNav}
        >
          <div className="header__hamburger-menu-line"></div>
          <div className="header__hamburger-menu-line"></div>
          <div className="header__hamburger-menu-line"></div>
        </div>
        <button 
          className={`header__nav-close-btn ${isCloseBtnShown ? 'header__nav-close-btn_active' : ''}`}
          onClick={handleToggleMobileNav} 
        />
      </div>
      <Nav 
        isUserLoggedIn={isUserLoggedIn}
        isMobileNavOpen={isMobileNavOpen}
        isCloseBtnShown={isCloseBtnShown}
        isHamburgerMenuShown={isHamburgerMenuShown}
        {...otherProps} 
      />
    </header>
  );
}

export default Header;
