import React from 'react';

const CardBuilder = ({ num, onChange }) => {
    const termId = `term${num + 1}`;
    const defId = `def${num + 1}`;

    const handleInputChange = (e, inputType) => {
        const value = e.target.value;
        if (inputType === 'term') {
            onChange(num, 'term', value);
        } else {
            onChange(num, 'definition', value);
        }
    };

    return (
        <div className="cardBuilder">
            <div className="smallerBox">
                <h3>{num}</h3>
                <div className="flex">
                    <div className="flex-child">
                        <input 
                            type="text" 
                            id={termId} 
                            className="textInput2" 
                            placeholder="Term..." 
                            onChange={(e) => handleInputChange(e, 'term')}
                        />
                        <label htmlFor={termId}><h3>Enter a term</h3></label>
                    </div>
                    <div className="flex-child">
                        <input 
                            type="text" 
                            id={defId} 
                            className="textInput2" 
                            placeholder="Definition..." 
                            onChange={(e) => handleInputChange(e, 'definition')}
                        />
                        <label htmlFor={defId}><h3>Enter a definition</h3></label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardBuilder;