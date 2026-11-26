import React from 'react';
import { Link } from 'react-router-dom';

const HomeCard = ({ setid, setname, totalcards }) => {
    return (
        <Link id="link" className="active" to={"/set/" + encodeURIComponent(setid)}>
            <div className="set">
                <h2 className="floatLeft font-bold">
                    {setname}
                </h2>
                <br />
                <p id="cardCount">
                    {"Total cards: " + totalcards}
                </p>
            </div>
        </Link>
    );
};

export default HomeCard;
