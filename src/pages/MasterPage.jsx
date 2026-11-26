import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import Title from '../components/Title';
import SetCards from '../components/SetCards';
import Spinner from '../components/BoltSpinner';
import confetti from 'canvas-confetti';
import useFlashCardController from '../hooks/useFlashCardController';

// Flip: 0, 1
// Multiple choice: 2, 3
// Typing: 4
// Mastered: 5

const MasterPage = () => {
    const { id } = useParams();
    const numLevels = 5;

    const {
        set,
        setName,
        currentIndex,
        isFlipped,
        totalDone,
        interval,
        setWrong,
        allDone,
        roundComplete,
        restart,
        nextCard,
        triggerConfetti,
        testRadio,
        handleTextForm,
        showFeedback,
        setShowFeedback,
        wait,
        isLoading,
        isSaving,
        error,
        saveError
    } = useFlashCardController(id, numLevels);

    const currentCard = set[currentIndex];

    // Celebrate completed rounds.
    useEffect(() => {
        if (isLoading || showFeedback.length > 0) return;

        if (allDone) {
            confetti({
                disableForReducedMotion: true
            });
        } else if (roundComplete) {
            triggerConfetti();
        }
    }, [allDone, roundComplete, isLoading, showFeedback]);

    // Generate multiple-choice answers and preserve their order
    // between renders.
    const choices = useMemo(() => {
        if (!currentCard) return [];

        if (currentCard.Mastery < 2 || currentCard.Mastery > 3) {
            return [];
        }

        const field = currentCard.Mastery % 2 === 0
            ? "Term"
            : "Definition";

        const correctAnswer = currentCard[field];

        const incorrectAnswers = [
            ...new Set(
                set
                    .map(card => card[field])
                    .filter(answer => answer !== correctAnswer)
            )
        ];

        function shuffleArray(arr) {
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

        const distractors = shuffleArray(incorrectAnswers)
            .slice(0, 3);

        return shuffleArray([
            correctAnswer,
            ...distractors
        ]);
    }, [set, currentIndex, currentCard]);

    // Error screen.
    if (error) {
        return (
            <>
                <Title title={setName || "Master"} back="true" />
                <p className="centerText">{error}</p>
            </>
        );
    }

    // Await authentication and database calls.
    if (isLoading) return null;

    // Empty set.
    if (set.length === 0) {
        return (
            <>
                <Title title={setName || "Master"} back="true" />
                <p className="centerText">
                    This set has no flashcards.
                </p>
            </>
        );
    }

    // Entire set has been mastered.
    if (allDone) {
        return (
            <>
                <Title title={setName} back="true" />

                <h1 className="centerText continue">
                    Great job, you're all done!
                </h1>

                {saveError && (
                    <p className="centerText" role="alert">
                        {saveError}
                    </p>
                )}

                {isSaving ? (
                    <p className="centerText">
                        Saving progress...
                    </p>
                ) : (
                    <SetCards setname={id} />
                )}

                <button
                    className="lowerRight grnBtn"
                    aria-label="Restart"
                    type="button"
                    onClick={restart}
                >
                    Click to restart!
                </button>
            </>
        );
    }

    // Show feedback when an answer was accepted by AI.
    if (showFeedback.length > 0 && currentCard) {
        function nextTrue() {
            setShowFeedback("");
            nextCard();
        }

        function nextFalse() {
            setShowFeedback("");
            setWrong();
            nextCard();
        }

        return (
            <>
                <Title title={setName} back="true" />

                <div className="feedbackBox">
                    <h1 className="centerText pad1">
                        Your answer was marked as correct by AI
                    </h1>

                    <p className="centerText">
                        {"The exact answer was: " + currentCard.Definition}
                    </p>

                    <p className="centerText">
                        {"You answered: " + showFeedback}
                    </p>

                    <div className="dualButtons pad5">
                        <button
                            className="centerLeftButton redBtn"
                            aria-label="Mark as wrong"
                            type="button"
                            onClick={nextFalse}
                        >
                            No, I was wrong...
                        </button>

                        <button
                            className="centerRightButton grnBtn"
                            aria-label="Continue"
                            type="button"
                            onClick={nextTrue}
                        >
                            Great! Next card
                        </button>
                    </div>

                    <img
                        id="mascot"
                        src="../../../mascot.svg"
                        alt=""
                    />
                </div>
            </>
        );
    }

    // Round completion screen.
    if (roundComplete) {
        return (
            <>
                <Title title={setName} back="true" />

                <h1 className="centerText continue">
                    Great job, press any button to continue
                </h1>

                {saveError && (
                    <p className="centerText" role="alert">
                        {saveError}
                    </p>
                )}

                {isSaving ? (
                    <p className="centerText">
                        Saving progress...
                    </p>
                ) : (
                    <SetCards setname={id} />
                )}
            </>
        );
    }

    // Protect against an invalid current card.
    if (!currentCard) {
        return (
            <>
                <Title title={setName} back="true" />

                <p className="centerText">
                    Unable to retrieve the current card.
                </p>
            </>
        );
    }

    // Mastery levels 0 and 1: flipping cards.
    if (currentCard.Mastery < 2) {
        return (
            <>
                <Title title={setName} back="true" />

                <div id="cardinfo">
                    <p id="cardnumber">
                        {totalDone + 1} out of {interval}
                    </p>
                </div>

                {currentCard.Mastery === 0 ? (
                    <FlashCard
                        term={currentCard.Term}
                        definition={currentCard.Definition}
                        flip={isFlipped}
                    />
                ) : (
                    <FlashCard
                        term={currentCard.Definition}
                        definition={currentCard.Term}
                        flip={isFlipped}
                    />
                )}
            </>
        );
    }

    // Mastery levels 2 and 3: multiple choice.
    if (currentCard.Mastery <= 3) {
        const termIsAnswer = currentCard.Mastery % 2 === 0;

        const correctAnswer = termIsAnswer
            ? currentCard.Term
            : currentCard.Definition;

        function renderChoice(choice, index) {
            return (
                <button
                    key={index}
                    id={`option${index}`}
                    className="smallCard"
                    type="button"
                    onClick={event => {
                        testRadio(
                            event,
                            choice,
                            index,
                            correctAnswer
                        );

                        event.currentTarget.blur();
                    }}
                >
                    <h1 id="cardtext">{choice}</h1>
                </button>
            );
        }

        return (
            <>
                <Title title={setName} back="true" />

                <div id="cardinfo">
                    <p className="centerText">
                        {totalDone + 1} out of {interval}
                    </p>
                </div>

                <h1 className="centerText">
                    {termIsAnswer
                        ? currentCard.Definition
                        : currentCard.Term}
                </h1>

                <form onSubmit={event => event.preventDefault()}>
                    <div className="cardContainer">
                        {choices.slice(0, 2).map(
                            (choice, index) =>
                                renderChoice(choice, index)
                        )}
                    </div>

                    <div className="cardContainer">
                        {choices.slice(2, 4).map(
                            (choice, index) =>
                                renderChoice(choice, index + 2)
                        )}
                    </div>
                </form>
            </>
        );
    }

    // Mastery level 4: typed answers with AI validation.
    return (
        <>
            <Title title={setName} back="true" />

            {wait && <Spinner />}

            <div id="cardinfo">
                <p className="centerText">
                    {totalDone + 1} out of {interval}
                </p>
            </div>

            <h1 className="centerText">
                {currentCard.Term}
            </h1>

            <form
                className="textForm"
                autoComplete="off"
                name="textForm"
                onSubmit={event => {
                    event.preventDefault();

                    if (!wait) {
                        handleTextForm(event);
                    }
                }}
            >
                <label htmlFor="guess">
                    <p>Enter the definition</p>
                </label>

                <input
                    type="text"
                    className="textInput1"
                    id="guess"
                    name="firstname"
                    placeholder="Definition..."
                />

                <input
                    type="submit"
                    value="Submit"
                    disabled={wait}
                />

                <p id="noShow">
                    {"The correct answer is: " + currentCard.Definition}
                    <br />
                    Enter the correct answer to continue
                </p>
            </form>
        </>
    );
};

export default MasterPage;
