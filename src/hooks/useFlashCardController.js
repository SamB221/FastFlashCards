import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from "../AuthContext";
import editSet from '../functions/editSet';

export function useFlashCardController(id, numLevels) {
    const { user, isLoading } = useAuth();

    const [set, setSet] = useState([]);
    const [setName, setSetName] = useState("");

    const [index, setIndex] = useState(0);
    const [flip, setFlip] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [totalDone, setTotalDone] = useState(0);

    const [showFeedback, setShowFeedback] = useState("");
    const [wait, setWait] = useState(false);

    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState("");
    const [saveError, setSaveError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const wrong = useRef(false);
    const transitionRef = useRef(null);
    const checkingRef = useRef(false);
    const sessionRef = useRef(0);

    // Keep database writes in the correct order.
    const saveQueue = useRef(Promise.resolve());
    const saveVersion = useRef(0);

    const interval = Math.min(10, set.length);

    const allDone =
        set.length > 0 &&
        set.every(card => card.Mastery >= numLevels);

    const roundComplete =
        set.length > 0 &&
        totalDone >= interval;

    // Load the flashcards and their display name.
    useEffect(() => {
        if (isLoading) return;

        let cancelled = false;
        sessionRef.current++;

        setIsFetching(true);
        setError("");
        setSaveError("");
        setIsSaving(false);
        setSet([]);
        setSetName("");
        setIndex(0);
        setTotalDone(0);
        setFlip(false);
        setCompleted(false);
        setShowFeedback("");
        setWait(false);

        wrong.current = false;
        checkingRef.current = false;

        async function fetchData() {
            try {
                const data = await editSet.getSetData(id, user);

                if (cancelled) return;

                if (!data || !Array.isArray(data.set)) {
                    setError("Unable to find this flashcard set.");
                    return;
                }

                if (data.set.length === 0) {
                    setError("This set has no flashcards.");
                    return;
                }

                const shuffled = data.set.map(card => ({
                    ...card,
                    Mastery: Number(card.Mastery) || 0
                }));

                shuffle(shuffled);

                setSet(shuffled);
                setSetName(data.name);

                setIndex(
                    findNextIndex(shuffled, 0)
                );
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

        fetchData();

        return () => {
            cancelled = true;
            sessionRef.current++;

            clearTimeout(transitionRef.current);
            transitionRef.current = null;
        };
    }, [id, user, isLoading, numLevels]);

    // Find the next card that has not been mastered.
    function findNextIndex(cards, startIndex) {
        if (cards.length === 0) return 0;

        for (let i = 0; i < cards.length; i++) {
            const candidate = (startIndex + i) % cards.length;

            if (cards[candidate].Mastery < numLevels) {
                return candidate;
            }
        }

        // Every card has been mastered.
        return 0;
    }

    // Keyboard controls.
    useEffect(() => {
        if (
            isLoading ||
            isFetching ||
            !set[index] ||
            allDone ||
            showFeedback.length > 0 ||
            wait
        ) {
            return;
        }

        function handleKeyDown(event) {
            const tag =
                document.activeElement?.tagName.toLowerCase();

            if (
                tag === 'input' ||
                tag === 'textarea' ||
                tag === 'select' ||
                tag === 'button' ||
                document.activeElement?.isContentEditable
            ) {
                return;
            }

            if (
                event.ctrlKey ||
                event.metaKey ||
                event.altKey ||
                event.repeat ||
                transitionRef.current !== null
            ) {
                return;
            }

            // Continue after a completed round.
            if (roundComplete) {
                event.preventDefault();
                setTotalDone(0);
                setFlip(false);
                setCompleted(false);
                return;
            }

            if (set[index].Mastery >= 2) return;

            switch (event.key) {
                case " ":
                case "ArrowUp":
                case "ArrowDown":
                    event.preventDefault();

                    setFlip(prev => !prev);
                    setCompleted(true);
                    break;

                case "ArrowRight":
                    event.preventDefault();

                    if (!completed) return;

                    if (flip && totalDone !== interval - 1) {
                        setFlip(false);

                        transitionRef.current = setTimeout(() => {
                            transitionRef.current = null;
                            nextCard();
                        }, 50);
                    } else {
                        nextCard();
                    }

                    break;

                default:
                    break;
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [
        index,
        totalDone,
        set,
        flip,
        completed,
        interval,
        roundComplete,
        allDone,
        wait,
        showFeedback,
        isLoading,
        isFetching
    ]);

    // Fisher-Yates shuffle.
    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr;
    }

    function nextCard() {
        if (!set[index] || allDone || roundComplete) return;

        // Update the card without mutating existing React state.
        const updatedSet = set.map((card, cardIndex) => {
            if (cardIndex !== index) return card;

            return {
                ...card,
                Mastery: wrong.current
                    ? Math.max(0, card.Mastery - 1)
                    : Math.min(numLevels, card.Mastery + 1)
            };
        });

        const nextIndex = findNextIndex(
            updatedSet,
            (index + 1) % updatedSet.length
        );

        wrong.current = false;

        setSet(updatedSet);
        setIndex(nextIndex);
        setTotalDone(prev => prev + 1);
        setCompleted(false);
        setFlip(false);

        saveSetToStorage(updatedSet);
    }

    function saveSetToStorage(newSet) {
        if (!id || !setName) return;

        const session = sessionRef.current;
        const version = ++saveVersion.current;

        setIsSaving(true);
        setSaveError("");

        // Snapshot the data being saved.
        const snapshot = newSet.map(card => ({ ...card }));

        saveQueue.current = saveQueue.current
            .catch(() => {})
            .then(() => {
                return editSet.updateSet(
                    id,
                    setName,
                    snapshot,
                    user
                );
            })
            .catch(error => {
                console.error("Unable to save mastery:", error);

                if (session === sessionRef.current) {
                    setSaveError("Unable to save mastery progress.");
                }
            })
            .finally(() => {
                if (
                    session === sessionRef.current &&
                    version === saveVersion.current
                ) {
                    setIsSaving(false);
                }
            });
    }

    function restart() {
        clearTimeout(transitionRef.current);
        transitionRef.current = null;

        const resetSet = set.map(card => ({
            ...card,
            Mastery: 0
        }));

        shuffle(resetSet);

        wrong.current = false;

        setSet(resetSet);
        setIndex(0);
        setTotalDone(0);
        setFlip(false);
        setCompleted(false);
        setShowFeedback("");

        saveSetToStorage(resetSet);
    }

    // Retained for compatibility with existing components.
    function generateRandom(exclude) {
        if (!set[exclude]) return [];

        const candidates = set
            .map((_, index) => index)
            .filter(index => index !== exclude);

        shuffle(candidates);

        return shuffle([
            ...candidates.slice(0, 3),
            exclude
        ]);
    }

    function testRadio(event, guess, id, correctAnswer) {
        event.preventDefault();

        if (guess === correctAnswer) {
            nextCard();
        } else {
            wrong.current = true;

            flashRed(
                document.getElementById("option" + id)
            );
        }
    }

    function flashRed(element) {
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

    async function handleTextForm(event) {
        event.preventDefault();

        if (
            checkingRef.current ||
            !set[index] ||
            allDone ||
            roundComplete
        ) {
            return;
        }

        const input = document.getElementById("guess");
        const feedback = document.getElementById("noShow");

        if (!input) return;

        const guess = input.value.trim();

        if (!guess) return;

        input.value = "";

        const currentCard = set[index];
        const definition = currentCard.Definition;

        if (
            guess.toLowerCase() ===
            definition.trim().toLowerCase()
        ) {
            input.classList.remove("invalid");

            if (feedback) {
                feedback.style.display = "none";
            }

            nextCard();
            return;
        }

        const session = sessionRef.current;

        checkingRef.current = true;
        setWait(true);

        try {
            const matches = await checkWithAI(
                currentCard.Term,
                guess
            );

            // Ignore outdated responses after leaving the set.
            if (session !== sessionRef.current) return;

            if (matches) {
                input.classList.remove("invalid");

                if (feedback) {
                    feedback.style.display = "none";
                }

                setShowFeedback(guess);
            } else {
                wrong.current = true;

                input.classList.add("invalid");

                if (feedback) {
                    feedback.style.display = "block";
                }
            }
        } finally {
            if (session === sessionRef.current) {
                checkingRef.current = false;
                setWait(false);
            }
        }
    }

    async function checkWithAI(term, guess) {
        if (
            term.length >= 200 ||
            guess.length >= 200 ||
            guess.length === 0
        ) {
            return false;
        }

        try {
            const res = await fetch(
                "/.netlify/functions/checkTerm",
                {
                    method: "POST",
                    body: JSON.stringify({
                        term,
                        definition: guess
                    }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!res.ok) {
                console.error("API error", res.status);
                return false;
            }

            const data = await res.json();

            return data.matches === true;

        } catch (error) {
            console.error("Fetch error", error);
            return false;
        }
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

    function setWrong() {
        wrong.current = true;
    }

    return {
        set,
        setName,
        currentIndex: index,
        isFlipped: flip,
        totalDone,
        interval,
        setWrong,
        allDone,
        roundComplete,
        restart,
        shuffle,
        nextCard,
        randomize: shuffle,
        triggerConfetti,
        setLength: set.length,
        generateRandom,
        testRadio,
        handleTextForm,
        showFeedback,
        setShowFeedback,
        wait,
        isLoading: isLoading || isFetching,
        isSaving,
        error,
        saveError
    };
}

export default useFlashCardController;
