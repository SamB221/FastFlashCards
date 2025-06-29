import React from 'react';

const CardBuilder = ({ id, num, onChange, removeCard }) => {
    const termId = `term${id}`;
    const defId = `def${id}`;

    const handleInputChange = (e, inputType) => {
        console.log(id);
        const value = e.target.value;
        if (inputType === 'term') {
            onChange(id, 'term', value);
        } else {
            onChange(id, 'definition', value);
        }
    };

    return (
        <div className="cardBuilder">
            <div className="smallerBox">
                <h3>{num}</h3>
                <span className="delete" onClick={() => removeCard(id)}>&times;</span>
                <div className="flex">
                    <div className="flex-child">
                        <input
                            type="text" 
                            autoComplete="off"
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
                            autoComplete="off"
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