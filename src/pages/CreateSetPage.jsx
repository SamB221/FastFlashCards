import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Title from '../components/Title';
import CardBuilder from '../components/CardBuilder';

const CreateSetPage = () => {
    const navigate = useNavigate();
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
        var set = [];
        const setName = document.getElementById('setName').value;
        if (setName.length == 0) {
            alert("Enter a set name before submitting"); //placeholder!
            return;
        } // other edge case to consider: set name already exists, prompt user again in this case

        Object.entries(cardData).forEach(([key, item]) => {
            var currentCard = new Object();
            currentCard.Term = item.term;
            currentCard.Definition = item.definition;
            currentCard.Mastery = 0;
            set[key - 1] = currentCard;
        });

        if (set.length < 4) {
            alert ("You need at least 4 terms to make a set"); // placeholder!
            return;
        }

        localStorage.setItem(setName, JSON.stringify({ set }));
        navigate("/");
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
        setNumCards(numCards + 1);
    };

    return (
        <>
            <Title title="Create a set" back="true" />
            <div id="setBuildingBox">
                <input 
                    type="text" 
                    autoComplete="off"
                    className="textInput2" 
                    id="setName" 
                    name="firstname" 
                    placeholder="Set name..." />
                <label htmlFor="setName"><p>Enter the set name</p></label>

                <div id="cardBuilders">
                    {Array.from({ length: numCards }, (_, i) => (
                        <CardBuilder key={i + 1} num={i + 1} onChange={handleCardChange}>
                            {i + 1}
                        </CardBuilder>
                    ))}

                    <form className="cardBuilder" onClick={addCard}>
                        <div className="smallerBox">
                            <h1 className="centerText noSelect"> + </h1>
                        </div>
                    </form>
                </div>
            </div>
            <form className="lowerRight grnBtn" onClick={handleSubmit}>
                <input type="button" value="Done" />
            </form>
        </>
    );
};

export default CreateSetPage;