import React from 'react';
import {FaHome} from 'react-icons/fa';
import {FaGear} from 'react-icons/fa6';
import './NavBar.css';

const NavBar = () => {
  return (
    <div className="navbar">
        <div id="websitename">
            <a id="homelink" className="active" href="/"><h1>FlashCards</h1></a>
        </div>
        <a className="active" href="/settings"><FaGear className="inline text-lg mr-1" />Settings</a>
        <a className="active" href="/"><FaHome className="inline text-lg mr-1" />Home</a>
    </div>
  );
};

export default NavBar;