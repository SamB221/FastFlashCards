import React, { useState, useRef, useEffect } from 'react';
import Title from '../components/Title';
import CardBuilder from '../components/CardBuilder';

const CreateSetPage = () => {
    const [numCards, setNumCards] = useState(4);
    const [cardData, setCardData] = useState({});
    const elementsAddedRef = useRef(false);

    // scrolls to the top when new element added
    useEffect(() => {
        if (elementsAddedRef.current) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            elementsAddedRef.current = false;
        }
    }, [numCards]);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('All form data:', cardData);
    };

    const handleCardChange = (cardNumber, inputType, value) => {
        setCardData(prevData => ({
        ...prevData,
        [cardNumber]: {
            ...prevData[cardNumber],
            [inputType]: value
        }
        }));
    };

    const addCard = (event) => {
        event.preventDefault();
        elementsAddedRef.current = true;
        setNumCards(numCards+1);
    };

    return (
        <>
            <Title title="Create a set" back="true" />
            <form id="setBuilder" onSubmit={handleSubmit}>
                <div id="setBuildingBox">
                    <input type="text" className="textInput2" id="setName" name="firstname" placeholder="Set name..."></input>
                    <label htmlFor="setName"><p>Enter the set name</p></label>
                    
                    <div id="cardBuilders">
                        {Array.from({ length: numCards }, (_, i) => (
                            <CardBuilder key={i+1} num={i+1} onChange={handleCardChange}>
                            {i + 1}
                            </CardBuilder>
                        ))}
                        
                        <form className="cardBuilder" onClick={addCard}>
                            <div className="smallerBox">
                                <h1 className="centerText"> + </h1>
                            </div>
                        </form>
                    </div>
                </div>
                <form className="lowerRight grnBtn" onClick={handleSubmit}>
                    <input type="button" value="Done"/>
                </form>
            </form>
        </>
    );
};

export default CreateSetPage;