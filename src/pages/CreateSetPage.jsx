import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Title from '../components/Title';
import CardBuilder from '../components/CardBuilder';

const CreateSetPage = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([0, 1, 2, 3]);
    const lastId = useRef(3); // last unique id used in cards, regardless of deletion
    const [cardData, setCardData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const modalRef = useRef(null);
    const elementsAddedRef = useRef(false);

    useEffect(() => {
        const modal = modalRef.current;
        var span = document.getElementsByClassName("close")[0];

        const handleClose = () => {
            modal.style.display = "none";
        };

        const handleOutsideClick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };

        span?.addEventListener("click", handleClose);
        window.addEventListener("click", handleOutsideClick);

        // scrolls to the top when new element added
        if (elementsAddedRef.current) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            elementsAddedRef.current = false;
        }

        return () => {
            span?.removeEventListener("click", handleClose);
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [cards]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const modal = modalRef.current;
        var set = [];
        const setName = document.getElementById('setName').value;

        if (setName.length == 0) {
            setErrorMessage("You must enter a set name to create a set");
            modal.style.display = "block";
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
            setErrorMessage("You need at least 4 terms to create a set");
            modal.style.display = "block";
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
        setCards(prevArray => [...prevArray, lastId.current]);
        lastId.current += 1;
    };

    const removeCard = (cardId) => {
        setCards((prevCards) => prevCards.filter(id => id !== cardId));

        setCardData((prevData) => {
            const newData = { ...prevData };
            delete newData[cardId];
            return newData;
        });
    };

    return (
        <>
        <div ref={modalRef} className="modal">

        <div className="modal-content">
            <div className="modal-header">
            <span className="close">&times;</span>
            <h1>Can't create set</h1>
            </div>
            <div className="modal-body">
            <h2>{errorMessage}</h2>
            </div>
        </div>

        </div>
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
                    {cards.map((cardId, index) => (
                        <CardBuilder
                            key={cardId}
                            id={cardId}
                            num={index + 1}
                            onChange={handleCardChange}
                            removeCard={removeCard}
                        >
                            {cardId}
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