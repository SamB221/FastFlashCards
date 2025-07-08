import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Title from '../components/Title';
import CardBuilder from '../components/CardBuilder';

const CreateSetPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [cards, setCards] = useState([0, 1, 2, 3]);
    const lastId = useRef(3); // last unique id used in cards, regardless of deletion
    const [cardData, setCardData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const modalRef = useRef(null);
    const elementsAddedRef = useRef(false);
    const hasBeenInitialized = useRef(false);

    const [originalSet, setOriginalSet] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem(id));
        return storedData ? storedData.set : null;
    });

    // initialize card data when the original set is loaded
    useEffect(() => {
        if (originalSet && !hasBeenInitialized.current) {
            hasBeenInitialized.current = true;
            addNCards(originalSet.length - 4);
            const initialCardData = originalSet.reduce((acc, card, index) => {
                acc[index] = { term: card.Term, definition: card.Definition };
                return acc;
            }, {});
            setCardData(initialCardData);
        }
    }, [originalSet]);

    // handles modal and scrolling logic
    useEffect(() => {
        const modal = modalRef.current;
        const span = document.getElementsByClassName("close")[0];

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
        const setName = document.getElementById('setName').value;
        const set = Object.entries(cardData).map(([cardId, data]) => ({
            Term: data.term,
            Definition: data.definition,
            Mastery: 0
        }));

        if (setName.length === 0) {
            setErrorMessage("You must enter a set name to create a set");
            modal.style.display = "block";
            return;
        }

        if (set.length < 4) {
            setErrorMessage("You need at least 4 terms to create a set");
            modal.style.display = "block";
            return;
        }

        if (isEdit && id != setName) {
            localStorage.removeItem(id);
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
        setCardData(prevData => ({
            ...prevData,
            [lastId.current]: { term: '', definition: '' }
        }));
    };

    const addNCards = (n) => {
        setCards(prevArray => {
            const newCards = Array.from({ length: n }, (_, i) => lastId.current + i + 1);
            lastId.current += n;
            return [...prevArray, ...newCards];
        });

        // 'import' card data from set user is editing
        setCardData(prevData => {
            const newCardData = {};
            for (let i = 0; i < n; i++) {
                const cardId = lastId.current - n + i + 1;
                newCardData[cardId] = { term: '', definition: '' };
            }
            return { ...prevData, ...newCardData };
        });
    };

    const removeCard = (cardId) => {
        setCards(prevCards => prevCards.filter(id => id !== cardId));
        setCardData(prevData => {
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

            <Title title={isEdit ? "Edit " + id : "Create Set"} back="true" />

            <div id="setBuildingBox">
                <input 
                    type="text" 
                    autoComplete="off"
                    className="textInput2" 
                    id="setName" 
                    name="firstname" 
                    defaultValue={id || ""}
                    placeholder="Set name..." />
                <label htmlFor="setName"><p>{isEdit ? "Edit set name" : "Enter the set name"}</p></label>

                <div id="cardBuilders">
                    {cards.map((cardId, index) => (
                        <CardBuilder
                            key={cardId}
                            id={cardId}
                            num={index + 1}
                            cardData={cardData[cardId]}
                            onChange={handleCardChange}
                            removeCard={removeCard}
                        />
                    ))}

                    <form className="cardBuilder" onClick={addCard}>
                        <div className="smallerBox">
                            <h1 className="centerText noSelect"> + </h1>
                        </div>
                    </form>
                </div>
            </div>

            <form className="lowerRight grnBtn" onClick={handleSubmit}>
                <input type="button" value={isEdit ? "Save Changes" : "Done"} />
            </form>
        </>
    );
};

export default CreateSetPage;