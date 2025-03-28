import React from 'react';
import PlayButton from './PlayButton';
import './UIBar.css';

const UIBar = (props) => {
  return (
    <div id="titlecontainer">
        <PlayButton id="playbutton"/>
        <div id="settitle">
            <h1>
              {props.title}
            </h1>
        </div>
    </div>
  );
};

export default UIBar;