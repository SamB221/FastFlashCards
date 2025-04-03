import React from 'react';
import {NavLink} from 'react-router-dom';
import {FaHome} from 'react-icons/fa';
import {FaGear} from 'react-icons/fa6';

const NavBar = () => {
  return (
    <div className="navbar alwaysWhite">
        <NavLink id="link" 
            className={({ isActive }) => isActive && 'activeNav'} 
            to="/"><FaHome className="inlineIcon" />Home</NavLink>
        <div id="websitename">
            <NavLink id="name" 
            className={({ isActive }) => isActive && 'activeNav'} 
            to="/"><h1>FlashCards</h1></NavLink>
        </div>
        <NavLink id="link" 
            className={({ isActive }) => isActive && 'activeNav'} 
            to="/settings"><FaGear className="inlineIcon" />Settings</NavLink>
    </div>
  );
};

export default NavBar;