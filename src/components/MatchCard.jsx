import React from 'react';

const MatchCard = ({ content }) => {
    if (!content) {
        <div className="miniCard"/>
    }

    return (
        <div className="miniCard">
            <h2 className='floatLeft font-bold'>
                {content}
            </h2>
        </div>
    );
};

export default MatchCard;