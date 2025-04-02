import React from 'react';
import './FlashCard.css';

const FlashCard = ({ term, definition, flip}) => {
    return (
        <div className="cardcontainer">
            <div id="card" className={flip ? 'flip' : ''}>
                <div id="cardfront">
                    <h1 id="cardtext">{term}</h1>
                </div>
                <div id="cardback">
                    <h1 id="cardtext">{definition}</h1>
                </div>
            </div>
        </div>
    );
};

export default FlashCard;