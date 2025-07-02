import React from 'react';

const MatchCard = ({ content, isSelected, onClick  }) => {
    if (!content) {
        return (
            <div></div>
        );
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