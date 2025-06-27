import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import Title from '../components/Title';
import SetCards from '../components/SetCards';
import confetti from 'canvas-confetti';
import useFlashCardController from '../hooks/useFlashCardController';

// flip, 0, flip, 1, mult, 2, mult, 3, type, 4, type, 5
const MasterPage = () => {
    const { id } = useParams();
    const numLevels = 5;
    const {
        set,
        currentIndex,
        isFlipped,
        totalDone,
        interval,
        setWrong,
        allDone,
        restart,
        shuffle,
        nextCard,
        randomize,
        triggerConfetti,
        generateRandom,
        testRadio,
        handleTextForm,
        showFeedback,
        setShowFeedback
    } = useFlashCardController(id, numLevels);
    const [skipped, setSkipped] = useState(0);

    // Reset page
    if (allDone) {
        confetti();
        return (
            <>
                <Title title={id} back="true" />
                <h1 className="centerText continue"> Great job, you're all done!</h1>
                <SetCards setname={id} />
                <form className="lowerRight grnBtn">
                    <input id="reset" type="button" value="Click to restart" onClick={restart}/>
                </form>
            </>
        );
    }

    if (showFeedback) {
        function nextTrue() {
            setShowFeedback(false);
            nextCard();
        }

        function nextFalse() {
            setShowFeedback(false);
            setWrong();
            nextCard();
        }

        return (
            <>
                <Title title={id} back="true" />
                <div className="feedbackBox">
                    <h1 className="centerText pad1">Your answer was marked as correct by AI</h1>
                    <p className="centerText">{"The exact answer was: " + set[currentIndex].Definition}</p>
                    <div className="dualButtons pad5">
                        <form className="centerLeftButton redBtn">
                            <input type="button" value="No, I was wrong..." onClick={nextFalse}/>
                        </form>
                        <form className="centerRightButton grnBtn">
                            <input type="button" value="Great! Next card" onClick={nextTrue}/>
                        </form>
                    </div>
                    <img id="manualIcon" src="../../../mascot.svg" />
                </div>
            </>
        );
    }

    if (totalDone == interval) {
        triggerConfetti();
        localStorage.setItem(id, JSON.stringify({set}));
        return (
            <div>
                <Title title={id} back="true" />
                <h1 className="centerText continue"> Great job, press any button to continue</h1>
                <SetCards setname={id} />
            </div>
        );
    }

    if (set[currentIndex].Mastery < 2) {
        return (
            <>
                <Title title={id} back="true" />
                <div id="cardinfo">
                    <p id="cardnumber">{totalDone + 1 + " out of " + interval}</p>
                </div>
                {(set[currentIndex].Mastery == 0)? 
                <FlashCard term={set[currentIndex].Term} definition={set[currentIndex].Definition} flip={isFlipped}/>:
                <FlashCard term={set[currentIndex].Definition} definition={set[currentIndex].Term} flip={isFlipped}/>}
            </>
        );
    } else if (set[currentIndex].Mastery <= 3) {
        var choiceIndices = generateRandom(currentIndex);
        randomize(choiceIndices);
        var choices = new Array(4);
        for (let i = 0; i < 4; i++) {
            choices[i] = (set[currentIndex].Mastery % 2 == 0)? set[choiceIndices[i]].Term: set[choiceIndices[i]].Definition;
        }
        const correctAnswer = (set[currentIndex].Mastery % 2 == 0)? set[currentIndex].Term: set[currentIndex].Definition;
        return (
            <>
                <Title title={id} back="true" />
                <div id="cardinfo">
                    <p className="centerText">{totalDone + 1 + " out of " + interval}</p>
                </div>
                {(set[currentIndex].Mastery % 2 == 0)?
                <h1 className="centerText">{set[currentIndex].Definition}</h1>:
                <h1 className="centerText">{set[currentIndex].Term}</h1>}
                <form>
                    <div className="cardContainer">
                        <button id="option0" className="smallCard" onClick={() => testRadio(event, choices[0], 0, correctAnswer)}>
                            <h1 id="cardtext">{choices[0]}</h1>
                        </button>
                        <button id="option1" className="smallCard" onClick={() => testRadio(event, choices[1], 1, correctAnswer)}>
                            <h1 id="cardtext">{choices[1]}</h1>
                        </button>
                    </div>
                    <div className="cardContainer">
                        <button id="option2" className="smallCard" onClick={() => testRadio(event, choices[2], 2, correctAnswer)}>
                            <h1 id="cardtext">{choices[2]}</h1>
                        </button>
                        <button id="option3" className="smallCard" onClick={() => testRadio(event, choices[3], 3, correctAnswer)}>
                            <h1 id="cardtext">{choices[3]}</h1>
                        </button>
                    </div>
                </form>
            </>
        );
    } else {
        return (
            <>
                <Title title={id} back="true" />
                <div id="cardinfo">
                    <p className="centerText">{totalDone + 1 + " out of " + interval}</p>
                </div>
                <h1 className="centerText">{set[currentIndex].Term}</h1>
                <form className="textForm" name="textForm" onSubmit={handleTextForm}>
                    <label htmlFor="guess"><p>Enter the definition</p></label>
                    <input type="text" className="textInput1" id="guess" name="firstname" placeholder="Definition..."></input>
                    <input type="submit" value="Submit"></input>
                    <p id="noShow">{"The correct answer is: " + set[currentIndex].Definition} <br />
                    Enter the correct answer to continue
                    </p>
                </form>
            </>
        );
    }
};

export default MasterPage;