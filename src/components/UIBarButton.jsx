import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './UIBarButton.css';

const PlayButton = ({ option, location }) => {
    const navigate = useNavigate();
    if (location.length == 0) {
        return (
            <Link id="learn" className="active" to={'..'} onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}> 
                {option}
            </Link>        
        );
    }

    return (
        <Link id="learn" className="active" to={location}> 
            {option}
        </Link>
    );
};

export default PlayButton;