import React from 'react';

const FlashCard = ({ term, definition, flip}) => {
    return (
        <div id="cardcontainer">
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