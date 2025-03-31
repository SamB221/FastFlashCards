import React from 'react';
import {Link} from 'react-router-dom';
import {FaHome} from 'react-icons/fa';
import {FaGear} from 'react-icons/fa6';

const NavBar = () => {
  return (
    <div className="navbar">
        <Link id="link" className="active" to="/"><FaHome className="inlineIcon" />Home</Link>
        <div id="websitename">
            <Link id="name" className="active" to="/"><h1>FlashCards</h1></Link>
        </div>
        <Link id="link" className="active" to="/settings"><FaGear className="inlineIcon" />Settings</Link>
    </div>
  );
};

export default NavBar;