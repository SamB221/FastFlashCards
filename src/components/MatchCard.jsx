import React from 'react';

const MatchCard = ({ id, content, isTerm, isSelected, onClick  }) => {
    if (!content) {
        return (
            <div className="matchPlaceHolder"></div>
        );
    }

    return (
        <div id={id} onClick={onClick} className={`matchCard ${isTerm ? 'mainColorBordered' : 'mainColor'} ${isSelected ? 'selected' : ''}`}>
            <h2 className='float-left noSelect'>
                {content}
            </h2>
        </div>
    );
};

export default MatchCard;