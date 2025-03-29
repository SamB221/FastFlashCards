import React from 'react';
import UIBarButton from './UIBarButton';
import './UIBar.css';

const UIBar = ({ title, option, location }) => {
  return (
    <div id="titlecontainer">
        <UIBarButton id="playbutton" option={option} location={location}/>
        <div id="settitle">
            <h1>
              {title}
            </h1>
        </div>
    </div>
  );
};

export default UIBar;