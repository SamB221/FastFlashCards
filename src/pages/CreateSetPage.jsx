import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Title from '../components/Title';
import CardBuilder from '../components/CardBuilder';
import { useAuth } from '../AuthContext';
import editSet from '../functions/editSet';

const CreateSetPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, isLoading } = useAuth();

    const isEdit = Boolean(id);

    const [setName, setSetName] = useState("");
    const [cards, setCards] = useState([0, 1, 2, 3]);
    const [cardData, setCardData] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [editLoaded, setEditLoaded] = useState(false);

    const lastId = useRef(3);
    const modalRef = useRef(null);
    const elementsAddedRef = useRef(false);

    function showError(message) {
        setErrorMessage(message);

        if (modalRef.current) {
            modalRef.current.style.display = "block";
        }
    }

    // Load an existing set when editing.
    useEffect(() => {
        if (isLoading) return;

        if (!isEdit) {
            setSetName("");
            setCards([0, 1, 2, 3]);
            setCardData({});
            lastId.current = 3;
            setEditLoaded(true);
            return;
        }

        let cancelled = false;
        setEditLoaded(false);

        async function loadSet() {
            try {
                const data = await editSet.getSetData(id, user);

                if (cancelled) return;

                if (!data) {
                    navigate("/");
                    return;
                }

                setSetName(data.name);

                const cardIds = data.set.map(
                    (_, index) => index
                );

                setCards(cardIds);
                lastId.current = cardIds.length - 1;

                const initialCardData = data.set.reduce(
                    (acc, card, index) => {
                        acc[index] = {
                            term: card.Term,
                            definition: card.Definition,
                            mastery: card.Mastery ?? 0
                        };

                        return acc;
                    },
                    {}
                );

                setCardData(initialCardData);
                setEditLoaded(true);
            } catch (error) {
                console.error(error);

                if (!cancelled) {
                    showError("Unable to load this set.");
                }
            }
        }

        loadSet();

        return () => {
            cancelled = true;
        };
    }, [id, user, isLoading, isEdit, navigate]);

    // Modal and scrolling logic.
    useEffect(() => {
        const modal = modalRef.current;
        const span = document.getElementsByClassName("close")[0];

        const handleClose = () => {
            if (modal) modal.style.display = "none";
        };

        const handleOutsideClick = (event) => {
            if (modal && event.target === modal) {
                modal.style.display = "none";
            }
        };

        span?.addEventListener("click", handleClose);
        window.addEventListener("click", handleOutsideClick);

        if (elementsAddedRef.current) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });

            elementsAddedRef.current = false;
        }

        return () => {
            span?.removeEventListener("click", handleClose);
            window.removeEventListener("click", handleOutsideClick);
        };
    }, [cards]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isLoading || isSaving || !editLoaded) return;

        const name = setName.trim();

        const set = cards.map(cardId => ({
            Term: cardData[cardId]?.term?.trim() || "",
            Definition: cardData[cardId]?.definition?.trim() || "",
            Mastery: cardData[cardId]?.mastery ?? 0
        })).filter(card => card.Term && card.Definition);

        if (!name) {
            showError("You must enter a set name to create a set");
            return;
        }

        if (set.length < 4) {
            showError("You need at least 4 complete cards to create a set");
            return;
        }

        setIsSaving(true);

        try {
            if (isEdit) {
                await editSet.updateSet(id, name, set, user);
            } else {
                await editSet.createSet(name, set, user);
            }

            navigate("/");
        } catch (error) {
            console.error("Unable to save set:", error);
            showError("Unable to save your set. Please try again.");
        } finally {
            setIsSaving(false);
        }
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

        const newId = ++lastId.current;

        setCards(prevArray => [...prevArray, newId]);

        setCardData(prevData => ({
            ...prevData,
            [newId]: {
                term: '',
                definition: '',
                mastery: 0
            }
        }));
    };

    const removeCard = (cardId) => {
        setCards(prevCards =>
            prevCards.filter(id => id !== cardId)
        );

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
                        <h1>Can't save set</h1>
                    </div>

                    <div className="modal-body">
                        <h2>{errorMessage}</h2>
                    </div>
                </div>
            </div>

            <Title
                title={isEdit ? "Edit " + setName : "Create Set"}
                back="true"
            />

            {editLoaded && !isLoading ? (
                <>
                    <div id="setBuildingBox">
                        <input
                            type="text"
                            autoComplete="off"
                            className="textInput2"
                            id="setName"
                            name="firstname"
                            value={setName}
                            onChange={event =>
                                setSetName(event.target.value)
                            }
                            maxLength={100}
                            placeholder="Set name..."
                        />

                        <label htmlFor="setName">
                            <p>
                                {isEdit
                                    ? "Edit set name"
                                    : "Enter the set name"}
                            </p>
                        </label>

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

                            <form
                                className="cardBuilder"
                                onClick={addCard}
                            >
                                <div className="smallerBox">
                                    <h1 className="centerText noSelect">
                                        +
                                    </h1>
                                </div>
                            </form>
                        </div>
                    </div>

                    <button
                        className="lowerRight grnBtn"
                        onClick={handleSubmit}
                        disabled={isSaving}
                    >
                        {isSaving
                            ? "Saving..."
                            : isEdit
                                ? "Save Changes"
                                : "Done"}
                    </button>
                </>
            ) : (
                <p className="centerText">Loading...</p>
            )}
        </>
    );
};

export default CreateSetPage;
