import React from 'react';
import {Link} from 'react-router-dom';
import './PlayButton.css';

const PlayButton = () => {
  return (
    <Link id="learn" className="active" to="go"> 
        Learn
    </Link>
  );
};

export default PlayButton;