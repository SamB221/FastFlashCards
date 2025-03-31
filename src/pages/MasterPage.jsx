import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import UIBar from '../components/UIBar';
import SetCards from '../components/SetCards';
import confetti from 'canvas-confetti';
import './MasterPage.css';

// flip, 0, flip, 1, mult, 2, mult, 3, type, 4, type, 5
const MasterPage = () => {
    const { id } = useParams();
    const [flip, setFlip] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [index, setIndex] = useState(0);
    const [totalDone, setTotalDone] = useState(0);
    const [randomized, setRandomized] = useState(false);
    const [set, setOriginalSet] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem(id));
        return storedData ? storedData.set : null;
    });
    if (!randomized) {
        randomize(set);
        setRandomized(true);
    } 

    function randomize(arr) {
        // A Fisher-Yates shuffle
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); 
            [arr[i], arr[j]] = [arr[j], arr[i]];
        } 
    }

    function testRadio(event) {
        event.preventDefault();
        const selectedRadio = document.querySelector('input[name="radio"]:checked');
        if (selectedRadio.value === set[index].Definition) {
            set[index].Mastery = set[index].Mastery + 1;
            setIndex(index + 1);
            setTotalDone(totalDone + 1);
            setCompleted(false);
        } else {
            // Handle false
        }
    }

    function switchRight() {
        set[index].Mastery = set[index].Mastery + 1;
        setIndex(index + 1);
        setTotalDone(totalDone + 1);
        setCompleted(false);
    }

    function generateRandom(exclude) { // Improve runtime in the future
        const randomNumbers = new Set();
        while (randomNumbers.size < 3) {
            const randomNumber = Math.floor(Math.random() * (set.length-1));
            if (randomNumber != exclude) {
                randomNumbers.add(randomNumber);
            }
        }

        randomNumbers.add(exclude);

        return [...randomNumbers];
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
    
    useEffect(() => {
        const handleKeyDown = (event) => {
            event.preventDefault();
            if (index >= set.length) {
                setIndex(0);
            } else {
                if (event.key === " "|| event.key === "ArrowUp" || event.key === "ArrowDown") {
                    setFlip(!flip);
                    setCompleted(true);
                } else if (event.key === "ArrowRight") {
                    if (completed) {
                        if (flip) {
                            setFlip(false);
                            setTimeout(switchRight, 50); // Without delay when flipping, people could cheat!
                        } else {
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
    }, [flip, index]);

    if (index >= set.length) {
        localStorage.setItem(id, JSON.stringify({set}));
        return (
            <div>
                <p>Great job, press any button to continue</p>
                <SetCards setname={id} />
            </div>
        );
    }

    if (set[index].Mastery < 2) {
        return (
            <>
                <UIBar title={id} option="Back" location=""/>
                <div id="cardinfo">
                    <p id="cardnumber">{index + 1 + " out of " + set.length}</p>
                </div>
                {(set[index].Mastery == 0)? 
                <FlashCard term={set[index].Term} definition={set[index].Definition} flip={flip}/>:
                <FlashCard term={set[index].Definition} definition={set[index].Term} flip={flip}/>}
            </>
        );
    } else {
        var choices = generateRandom(index);
        randomize(choices);
        return (
            <>
                <UIBar title={id} option="Back" location=""/>
                <div id="cardinfo">
                    <p id="cardnumber">{index + 1 + " out of " + set.length}</p>
                </div>
                <h1 class="radioquestion">{set[index].Term}</h1>
                <form>
                    <div class="radio">
                      <div class="radiocontainer">
                          <label class="form-control">
                               <input type="radio" name="radio" value={set[choices[0]].Definition}/>
                               {set[choices[0]].Definition}
                          </label>

                            <label class="form-control">
                                <input type="radio" name="radio" value={set[choices[1]].Definition}/>
                                {set[choices[1]].Definition}
                            </label>

                            <label class="form-control">
                                <input type="radio" name="radio" value={set[choices[2]].Definition}/>
                                {set[choices[2]].Definition}
                            </label>

                            <label class="form-control">
                                <input type="radio" name="radio" value={set[choices[3]].Definition}/>
                                {set[choices[3]].Definition}
                            </label>

                            <div id="radiosubmit" class="radiosubmit" onClick={() => testRadio(event, set[index].Definition)}>
                                <button type="submit">Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </>
        );
    }
};

export default MasterPage;