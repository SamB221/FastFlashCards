import React from 'react';
import {Link} from 'react-router-dom';
import {FaHome} from 'react-icons/fa';
import {FaGear} from 'react-icons/fa6';
import './NavBar.css';

const NavBar = () => {
  return (
    <div className="navbar">
        <div id="websitename">
            <Link id="name" className="active" to="/"><h1>FlashCards</h1></Link>
        </div>
        <Link id="link" className="active" to="/settings"><FaGear className="inline text-lg mr-1" />Settings</Link>
        <Link id="link" className="active" to="/"><FaHome className="inline text-lg mr-1" />Home</Link>
    </div>
  );
};

export default NavBar;