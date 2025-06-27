import React from 'react';

const FlashCard = ({ num }) => {
    const termId = `term${num + 1}`;
    const defId = `def${num + 1}`;
    return (
        <div className="cardBuilder">
            <div className="smallerBox">
                <h3>{num}</h3>
                <div className="flex">
                    <div className="flex-child">
                        <input type="text" id={termId} className="textInput2" name="firstname" placeholder="Term..."></input>
                        <label htmlFor={termId}><h3>Enter a term</h3></label>
                    </div>
                    <div className="flex-child">
                        <input type="text" id={defId} className="textInput2" name="firstname" placeholder="Definition..."></input>
                        <label htmlFor={defId}><h3>Enter a definition</h3></label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashCard;