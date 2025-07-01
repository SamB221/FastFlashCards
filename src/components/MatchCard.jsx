import React from 'react';

const MatchCard = ({ content, isSelected, onClick  }) => {
    if (!content) {
        <div className="miniCard"/>
    }

    return (
        <div onClick={onClick} className={`miniCard ${isSelected ? 'selected' : ''}`}>
            <h2 className='float-left'>
                {content}
            </h2>
        </div>
    );
};

export default MatchCard;