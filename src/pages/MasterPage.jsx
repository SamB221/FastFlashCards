import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import Title from '../components/Title';
import SetCards from '../components/SetCards';
import confetti from 'canvas-confetti';

// flip, 0, flip, 1, mult, 2, mult, 3, type, 4, type, 5
const MasterPage = () => {
    const { id } = useParams();
    var wrong = false; 
    const numLevels = 5;
    const [flip, setFlip] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [index, setIndex] = useState(0);
    const [totalDone, setTotalDone] = useState(0);
    const [randomized, setRandomized] = useState(false);
    const [set, setOriginalSet] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem(id));
        return storedData ? storedData.set : null;
    });
    const interval = Math.min(set.length, 10);
    if (!randomized) {
        randomize(set);
        setRandomized(true);
    } 

    if (set[index].Mastery > numLevels) {
        setIndex((index + 1) % set.length);
    }

    function randomize(arr) {
        // A Fisher-Yates shuffle
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); 
            [arr[i], arr[j]] = [arr[j], arr[i]];
        } 
    }

    function testRadio(event, guess, id) {
        event.preventDefault();
        if (guess === set[index].Definition) {
            set[index].Mastery = wrong? set[index].Mastery - 1: set[index].Mastery + 1;
            setIndex((index + 1) % set.length);
            setTotalDone(totalDone + 1);
            setCompleted(false);
        } else {
            flashRed(document.getElementById("option" + id));
            wrong = "true";
        }
    }

    function flashRed(element) {
        let originalColor = element.style.backgroundColor;
        
        // Clear ongoing transitions
        element.style.transition = "none";
        element.style.backgroundColor = "rgba(255, 0, 0, 0.3)"; 
    
        void element.offsetWidth;
    
        element.style.transition = "background-color 0.5s ease"; 
    
        setTimeout(function() {
            element.style.backgroundColor = originalColor;
        }, 200); 
    }

    function switchRight() {
        set[index].Mastery = set[index].Mastery + 1;
        setIndex((index + 1) % set.length);
        setTotalDone(totalDone + 1);
        setCompleted(false);
    }

    function generateRandom(exclude) {
        const randomNumbers = new Set();
        while (randomNumbers.size < 3) {
            var randomNumber = Math.floor(Math.random() * (set.length-1));
            while (randomNumber == exclude || randomNumbers.has(randomNumber)) {
                randomNumber = (randomNumber + 1) % set.length;
            }

            randomNumbers.add(randomNumber);
        }

        randomNumbers.add(exclude);

        return [...randomNumbers];
    }

    function handleTextForm(e) {
        e.preventDefault();
        let x = document.forms['textForm']['guess'].value;
        if (x === set[index].Definition) {
            set[index].Mastery = wrong? set[index].Master -1: set[index].Mastery + 1;
            setIndex((index + 1) % set.length);
            setTotalDone(totalDone + 1);
        } else {
            wrong = true;
            document.getElementById('guess').classList.add("invalid");
            document.getElementById('noShow').style.display = 'block';
        }
    }

    const triggerConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 160,
          origin: { x: 0.5, y: 0.5 },
          zIndex: -1,
          duration: 200,
          disableForReducedMotion: true
        });
    }

    window.addEventListener('beforeunload', () => {
        confetti.clear();
    });
    
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (set[index].Mastery == 5) return;
            event.preventDefault();
            if (totalDone == interval) {
                setTotalDone(0);
                setFlip(false);
            } else if (set[index].Mastery < 2) {
                if (event.key === " "|| event.key === "ArrowUp" || event.key === "ArrowDown") {
                    setFlip(!flip);
                    setCompleted(true);
                } else if (event.key === "ArrowRight") {
                    if (completed) {
                        if (flip && set[(index + 1) % set.length].Mastery < 2 && totalDone != interval - 1) {
                            console.log(set[(index + 1) % set.length]);
                            setFlip(false);
                            setTimeout(switchRight, 50); // Without delay when flipping, people could cheat!
                        } else {
                            console.log(set[(index + 1) % set.length].Mastery);
                            console.log("here");
                            switchRight();
                        }
                    }
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [flip, index, totalDone]);

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

    if (set[index].Mastery < 2) {
        return (
            <>
                <Title title={id} back="true" />
                <div id="cardinfo">
                    <p id="cardnumber">{totalDone + 1 + " out of " + interval}</p>
                </div>
                {(set[index].Mastery == 0)? 
                <FlashCard term={set[index].Term} definition={set[index].Definition} flip={flip}/>:
                <FlashCard term={set[index].Definition} definition={set[index].Term} flip={flip}/>}
            </>
        );
    } else if (set[index].Mastery < numLevels) {
        var choices = generateRandom(index);
        randomize(choices);
        return (
            <>
                <Title title={id} back="true" />
                <div id="cardinfo">
                    <p className="centerText">{totalDone + 1 + " out of " + interval}</p>
                </div>
                <h1 className="centerText">{set[index].Term}</h1>
                <form>
                    <div className="cardContainer">
                        <button id="option0" className="smallCard" onClick={() => testRadio(event, set[choices[0]].Definition, 0)}>
                            <h1 id="cardtext">{set[choices[0]].Definition}</h1>
                        </button>
                        <button id="option1" className="smallCard" onClick={() => testRadio(event, set[choices[1]].Definition, 1)}>
                            <h1 id="cardtext">{set[choices[1]].Definition}</h1>
                        </button>
                    </div>
                    <div className="cardContainer">
                        <button id="option2" className="smallCard" onClick={() => testRadio(event, set[choices[2]].Definition, 2)}>
                            <h1 id="cardtext">{set[choices[2]].Definition}</h1>
                        </button>
                        <button id="option3" className="smallCard" onClick={() => testRadio(event, set[choices[3]].Definition, 3)}>
                            <h1 id="cardtext">{set[choices[3]].Definition}</h1>
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
                <h1 className="centerText">{set[index].Term}</h1>
                <form className="textForm" name="textForm" onSubmit={handleTextForm}>
                    <label for="guess"><p>Enter the definition</p></label>
                    <input type="text" id="guess" name="firstname" placeholder="Definition..."></input>
                    <input type="submit" value="Submit"></input>
                    <p id="noShow">{"The correct answer is: " + set[index].Definition} <br />
                    Enter the correct answer to continue
                    </p>
                </form>
            </>
        );
    }
};

export default MasterPage;