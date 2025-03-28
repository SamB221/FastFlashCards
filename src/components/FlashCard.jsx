import React from 'react';
import './FlashCard.css';

const FlashCard = ({ term, definition, flip}) => {
    if (!flip) {
        return (
            <div id="cardfront">
                <h1>{term}</h1>
            </div>
        );
    }
    return (
        <div id="cardback">
            <h1>{definition}</h1>
        </div>
    );
};

export default FlashCard;