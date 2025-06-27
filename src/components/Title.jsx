import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Title = ({ title, back }) => {
  const navigate = useNavigate();
    return (
        <div id="pageTitle">
            {back ? <Link id="backButton" aria-label="Go back" className="active" to={'..'} onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}><h1>&lt;</h1></Link>: <></>}
            <h1>
                {title}
            </h1>
        </div>
    );
};

export default Title;