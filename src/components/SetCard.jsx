import React from 'react';

const SetCard = ({ term, definition, mastery, bg = 'bg-gray-100' }) => {
    return (
        <div className="miniCard">
            <h2 className='floatLeft font-bold'>
                {term}
            </h2>
            <p className='floatRight'>
                {"Mastery: " + mastery}
            </p>
            <br />
            <p id="cardCount">
                {definition}
            </p>
        </div>
    );
};

export default SetCard;