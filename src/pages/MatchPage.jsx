import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../components/Title';
import MatchCard from '../components/MatchCard';
import confetti from 'canvas-confetti';
import { useAuth } from "../AuthContext";
import editSet from '../functions/editSet';

const MatchPage = () => {
    const { user, isLoading } = useAuth();
    const { id } = useParams();

    const [setName, setSetName] = useState("");
    const [counter, setCounter] = useState(0);
    const [set, setOriginalSet] = useState([]);

    const [remainingCards, setRemainingCards] = useState([]);
    const [currentCards, setCurrentCards] = useState([]);

    const [selectedCard, setSelectedCard] = useState(null);
    const [finishedScreen, setFinishedScreen] = useState(false);
    const [progressBar, setProgressBar] = useState(0);

    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState("");

    const timerRef = useRef(null);
    const recordSavedRef = useRef(false);

    // Retrieve the set and its display name.
    useEffect(() => {
        if (isLoading) return;

        let cancelled = false;

        setIsFetching(true);
        setError("");
        setOriginalSet([]);
        setCurrentCards([]);
        setRemainingCards([]);
        setSelectedCard(null);
        setFinishedScreen(false);
        setCounter(0);
        setProgressBar(0);
        recordSavedRef.current = false;

        async function fetchSet() {
            try {
                const data = await editSet.getSetData(id, user);

                if (cancelled) return;

                if (!data || !Array.isArray(data.set)) {
                    setError("Unable to find this flashcard set.");
                    return;
                }

                setOriginalSet(data.set);
                setSetName(data.name);
            } catch (error) {
                console.error("Unable to load set:", error);

                if (!cancelled) {
                    setError("Unable to load this flashcard set.");
                }
            } finally {
                if (!cancelled) {
                    setIsFetching(false);
                }
            }
        }

        fetchSet();

        return () => {
            cancelled = true;
        };
    }, [id, user, isLoading]);

    // Start the timer only once the cards are ready.
    useEffect(() => {
        if (
            finishedScreen ||
            isLoading ||
            isFetching ||
            set.length === 0 ||
            currentCards.length === 0
        ) {
            return;
        }

        timerRef.current = setInterval(() => {
            setCounter(prevCounter => prevCounter + 0.1);
        }, 100);

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [
        finishedScreen,
        isLoading,
        isFetching,
        set.length,
        currentCards.length
    ]);

    // Initialize the game when a set is loaded.
    useEffect(() => {
        if (!set.length) return;

        initializeGame(set);
    }, [set]);

    // Save the record once after completing the game.
    useEffect(() => {
        if (
            finishedScreen &&
            !isLoading &&
            !isFetching &&
            !recordSavedRef.current
        ) {
            recordSavedRef.current = true;

            editSet.setRecord(
                id,
                user,
                Number(counter.toFixed(1))
            ).catch(error => {
                console.error("Unable to save record:", error);
            });
        }
    }, [finishedScreen, id, user, counter, isLoading, isFetching]);

    function initializeGame(cards) {
        const initialNum = window.innerWidth <= 650 ? 8 : 16;

        // Each term and definition shares a unique pair ID.
        const shuffled = randomize(
            cards.map((card, index) => ({
                ...card,
                pairId: index
            }))
        );

        const termsAndDefs = [];

        while (shuffled.length > 0) {
            let currentBatch = [];

            for (
                let i = 0;
                i < initialNum / 2 && shuffled.length > 0;
                i++
            ) {
                const current = shuffled.pop();

                currentBatch.push({
                    content: current.Term,
                    isTerm: true,
                    pairId: current.pairId
                });

                currentBatch.push({
                    content: current.Definition,
                    isTerm: false,
                    pairId: current.pairId
                });
            }

            currentBatch = randomize(currentBatch);
            termsAndDefs.push(...currentBatch);
        }

        setCurrentCards(termsAndDefs.slice(0, initialNum));
        setRemainingCards(termsAndDefs.slice(initialNum));
        setSelectedCard(null);
    }

    function randomize(arr) {
        const shuffled = [...arr];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [shuffled[i], shuffled[j]] = [
                shuffled[j],
                shuffled[i]
            ];
        }

        return shuffled;
    }

    function onClick(index) {
        const card = currentCards[index];

        // Ignore empty card positions.
        if (!card || finishedScreen) return;

        if (selectedCard === null) {
            setSelectedCard(index);
        } else if (selectedCard === index) {
            // Clicking the same card deselects it.
            setSelectedCard(null);
        } else if (match(card, currentCards[selectedCard])) {
            remove(index, selectedCard);
            setSelectedCard(null);
        } else {
            flashRed(index);
            flashRed(selectedCard);
            setSelectedCard(null);
        }
    }

    function match(card1, card2) {
        if (!card1 || !card2) return false;

        // A term must be matched with a definition.
        if (card1.isTerm === card2.isTerm) return false;

        // Also accept equivalent answers when duplicate
        // terms or definitions exist.
        const termCard = card1.isTerm ? card1 : card2;
        const definitionCard = card1.isTerm ? card2 : card1;

        return (
            termCard.pairId === definitionCard.pairId ||
            set[termCard.pairId].Definition === definitionCard.content &&
            set[definitionCard.pairId].Term === termCard.content
        );
    }

    function remove(index1, index2) {
        const updatedCards = [...currentCards];

        updatedCards[index1] = null;
        updatedCards[index2] = null;

        setCurrentCards(updatedCards);

        const activeCards = updatedCards.filter(
            card => card !== null
        ).length;

        setProgressBar(
            1 - (remainingCards.length + activeCards) /
            (set.length * 2)
        );

        if (activeCards === 0) {
            const nextBatchSize = Math.min(
                currentCards.length,
                remainingCards.length
            );

            if (nextBatchSize === 0) {
                clearInterval(timerRef.current);
                timerRef.current = null;

                setFinishedScreen(true);
                triggerConfetti();
            } else {
                setCurrentCards(
                    remainingCards.slice(0, nextBatchSize)
                );

                setRemainingCards(prevDeck =>
                    prevDeck.slice(nextBatchSize)
                );
            }
        }
    }

    function flashRed(id) {
        const element = document.getElementById(id);

        if (!element) return;

        const originalColor = element.style.backgroundColor;

        element.style.transition = "none";
        element.style.backgroundColor = "rgba(255, 0, 0, 0.3)";

        void element.offsetWidth;

        element.style.transition = "background-color 0.5s ease";

        setTimeout(() => {
            element.style.backgroundColor = originalColor;
        }, 200);
    }

    function triggerConfetti() {
        confetti({
            particleCount: 100,
            spread: 160,
            origin: { x: 0.5, y: 0.5 },
            zIndex: -1,
            disableForReducedMotion: true
        });
    }

    function reset() {
        clearInterval(timerRef.current);
        timerRef.current = null;

        recordSavedRef.current = false;

        setCounter(0);
        setFinishedScreen(false);
        setProgressBar(0);
        setSelectedCard(null);

        // Reuse the loaded set rather than fetching it again.
        initializeGame(set);
    }

    if (isLoading || isFetching) return null;

    if (error || set.length === 0) {
        return (
            <>
                <Title title={setName || "Match"} back="true" />

                <p className="centerText">
                    {error || "This set has no flashcards."}
                </p>
            </>
        );
    }

    if (finishedScreen) {
        return (
            <>
                <Title title={setName} back="true" />

                <div className="feedbackBox padBottom2">
                    <h1 className="centerText pad1 white">
                        Great job! You finished in {counter.toFixed(1)} seconds
                    </h1>

                    <button
                        className="centerBtn grnBtn"
                        aria-label="restart"
                        type="button"
                        onClick={reset}
                    >
                        Again!
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Title title={setName} back="true" />

            <section className="matchPage">
                <div className="matchStats">
                    <p className="matchTimer">
                        {counter.toFixed(1)}s
                    </p>

                    <progress
                        className="progressBar"
                        value={progressBar}
                        max={1}
                    />
                </div>

                <div className="matchGrid">
                    {currentCards.map((card, index) => (
                        <MatchCard
                            key={index}
                            id={index}
                            content={card ? card.content : null}
                            isTerm={card ? card.isTerm : null}
                            isSelected={selectedCard === index}
                            onClick={() => onClick(index)}
                        />
                    ))}
                </div>
            </section>
        </>
    );
};

export default MatchPage;
