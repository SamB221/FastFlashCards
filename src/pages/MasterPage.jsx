import React, { useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
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
    const location = useLocation();
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

    const displayName =
        setName || location.state?.setName || "";

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

    // Generate stable multiple-choice answers.
    const choices = useMemo(() => {
        if (!currentCard) return [];

        if (
            currentCard.Mastery < 2 ||
            currentCard.Mastery > 3
        ) {
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

        return shuffleArray([
            correctAnswer,
            ...shuffleArray(incorrectAnswers).slice(0, 3)
        ]);
    }, [set, currentIndex, currentCard]);

    function nextTrue() {
        setShowFeedback("");
        nextCard();
    }

    function nextFalse() {
        setShowFeedback("");
        setWrong();
        nextCard();
    }

    // Consistent progress indicator across mastery stages.
    function renderProgress() {
        return (
            <div id="cardinfo">
                <p id="cardnumber" className="centerText">
                    {totalDone + 1} out of {interval}
                </p>
            </div>
        );
    }

    // Render a multiple-choice button.
    function renderChoice(choice, index, correctAnswer) {
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

    // Render completion and round summary screens.
    function renderSummary(finished) {
        return (
            <>
                <h1 className="centerText continue">
                    {finished
                        ? "Great job, you're all done!"
                        : "Great job, press any button to continue"}
                </h1>

                {saveError && (
                    <p className="centerText" role="alert">
                        {saveError}
                    </p>
                )}

                {!isSaving && (
                    <div className="masterSummaryCards">
                        <SetCards setname={id} cards={set} animate={true} />
                    </div>
                )}

                {finished && (
                    <button
                        className="lowerRight grnBtn"
                        aria-label="Restart"
                        type="button"
                        onClick={restart}
                    >
                        Click to restart!
                    </button>
                )}
            </>
        );
    }

    // Render the appropriate mastery stage.
    function renderContent() {
        if (error) {
            return (
                <p className="centerText" role="alert">
                    {error}
                </p>
            );
        }

        if (set.length === 0) {
            return (
                <p className="centerText">
                    This set has no flashcards.
                </p>
            );
        }

        if (allDone) {
            return renderSummary(true);
        }

        // AI answer feedback.
        if (showFeedback.length > 0 && currentCard) {
            return (
                <div className="feedbackBox">
                    <h1 className="centerText pad1">
                        Your answer was marked as correct by AI
                    </h1>

                    <p className="centerText">
                        {"The exact answer was: " +
                            currentCard.Definition}
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
            );
        }

        if (roundComplete) {
            return renderSummary(false);
        }

        if (!currentCard) {
            return (
                <p className="centerText">
                    Unable to retrieve the current card.
                </p>
            );
        }

        // Levels 0 and 1: flipping flashcards.
        if (currentCard.Mastery < 2) {
            const reversed = currentCard.Mastery === 1;

            return (
                <>
                    {renderProgress()}

                    <FlashCard
                        term={
                            reversed
                                ? currentCard.Definition
                                : currentCard.Term
                        }
                        definition={
                            reversed
                                ? currentCard.Term
                                : currentCard.Definition
                        }
                        flip={isFlipped}
                    />
                </>
            );
        }

        // Levels 2 and 3: multiple choice.
        if (currentCard.Mastery <= 3) {
            const termIsAnswer =
                currentCard.Mastery % 2 === 0;

            const correctAnswer = termIsAnswer
                ? currentCard.Term
                : currentCard.Definition;

            return (
                <>
                    {renderProgress()}

                    <h1 className="centerText">
                        {termIsAnswer
                            ? currentCard.Definition
                            : currentCard.Term}
                    </h1>

                    <form
                        onSubmit={event =>
                            event.preventDefault()
                        }
                    >
                        <div className="cardContainer">
                            {choices.slice(0, 2).map(
                                (choice, index) =>
                                    renderChoice(
                                        choice,
                                        index,
                                        correctAnswer
                                    )
                            )}
                        </div>

                        <div className="cardContainer">
                            {choices.slice(2, 4).map(
                                (choice, index) =>
                                    renderChoice(
                                        choice,
                                        index + 2,
                                        correctAnswer
                                    )
                            )}
                        </div>
                    </form>
                </>
            );
        }

        // Level 4: typed answers with AI validation.
        return (
            <>
                {wait && <Spinner />}

                {renderProgress()}

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
                        {"The correct answer is: " +
                            currentCard.Definition}
                        <br />
                        Enter the correct answer to continue
                    </p>
                </form>
            </>
        );
    }

    return (
        <>
            {/* Keep the title mounted across all mastery stages. */}
            <Title title={displayName} back="true" />

            <div
                className="masterPageContent"
                aria-busy={isLoading}
            >
                {!isLoading && (
                    <div className="masterPageEnter" key={id}>
                        <div
                            key={
                                allDone ? "finished" :
                                roundComplete ? "summary" :
                                showFeedback.length > 0 ? "feedback" :
                                currentCard?.Mastery < 2 ? "flashcard" :
                                currentCard?.Mastery < 4 ? "multiple-choice" :
                                    "typing"
                            }
                            className="masterStage"
                        >
                            {renderContent()}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MasterPage;
