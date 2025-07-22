import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaSun, FaMoon, FaUser } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { useAuth0 } from "@auth0/auth0-react";


const NavBar = () => {
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
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
                <NavLink 
                    id="link" 
                    aria-label="Go to homepage"
                    className={({ isActive }) => isActive ? 'activeNav' : ''}
                    to="/">
                    <FaHome className="inlineIcon" />
                    <div className="hideMobile">Home</div>
                </NavLink>
            </div>
            <div id="websitename">
                <NavLink id="name" 
                to="/"><h1 id="websiteTitle">FlashCards</h1></NavLink>
                <img id="websiteImage" src="../../../slidefavicon.svg" />
            </div>
            <div id="rightSide">
                {isAuthenticated ? (
                    <button
                    id="link"
                    onClick={() =>
                        logout({ returnTo: window.location.origin })
                    }>
                        <FaUser className="inlineIcon" />
                        <div className="hideMobile">Log Out</div>
                    </button>
                    ) : (
                    <button id="link" onClick={() => loginWithRedirect()}>
                        <FaUser className="inlineIcon" />
                        <div className="hideMobile">Log In</div>
                    </button>
                )}
                <button id="themeSwitch" onClick={darkLightSwitcher}>
                <FaSun></FaSun>
                <FaMoon></FaMoon>
                </button>
            </div>
        </div>
    );
};

export default NavBar;