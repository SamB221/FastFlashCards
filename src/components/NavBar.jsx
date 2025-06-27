import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSun, FaMoon } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';


const NavBar = () => {
  let darkmode = localStorage.getItem('darkmode');
  const themeSwitch = document.getElementById('themeSwitch');

  const enableDarkMode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
  }
  
  const disableDarkMode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkmode', null);
  }

  if (darkmode === 'active') enableDarkMode();

  function darkLightSwitcher() {
    darkmode = localStorage.getItem('darkmode');
    darkmode !== 'active' ? enableDarkMode() : disableDarkMode();
  }

  return (
    <div className="navbar alwaysWhite">
        <div id="leftSide">
            <NavLink id="link" aria-label="Go to homepage"
            className={({ isActive }) => isActive ? 'activeNav' : ''}
            to="/"><FaHome className="inlineIcon" />Home</NavLink>
        </div>
        <div id="websitename">
            <NavLink id="name" 
            to="/"><h1>FlashCards</h1></NavLink>
        </div>
        <div id="rightSide">
            <NavLink id="link" aria-label="Toggle darkmode"
            className={({ isActive }) => isActive ? 'activeNav' : ''}
            to="/settings"><FaGear className="inlineIcon" />Settings</NavLink>
            <button id="themeSwitch" onClick={darkLightSwitcher}>
              <FaSun></FaSun>
              <FaMoon></FaMoon>
            </button>
        </div>
    </div>
  );
};

export default NavBar;