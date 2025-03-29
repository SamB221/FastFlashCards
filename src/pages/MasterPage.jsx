import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import UIBar from '../components/UIBar';
import SetCards from '../components/SetCards';
import confetti from 'canvas-confetti';
import './MasterPage.css'

const MasterPage = () => {
    const { id } = useParams();
    const [flip, setFlip] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [index, setIndex] = useState(0);
    const [totalDone, setTotalDone] = useState(0);
    const [sortedSet, setSortedSet] = useState("init");
    const [phase, setPhase] = useState(0);
    const [set, setOriginalSet] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem(id));
        return storedData ? storedData.set : null; // or default value
    });

    if (sortedSet === "init") {
        randomize();
    } 

    function randomize() {
        // A Fisher-Yates shuffle
        for (let i = set.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); 
            [set[i], set[j]] = [set[j], set[i]];
        } 

        setSortedSet(set);
    }

    function switchRight() {
        sortedSet[index].Mastery = sortedSet[index].Mastery + 1;
        setIndex(index + 1);
        setTotalDone(totalDone + 1);
        setCompleted(false);
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

    if (sortedSet[index].Mastery < 2) {
        return (
            <>
                <UIBar title={id} option="Back" location=""/>
                <div id="cardinfo">
                    <p id="cardnumber">{index + 1 + " out of " + set.length}</p>
                </div>
                <FlashCard term={sortedSet[index].Term} definition={sortedSet[index].Definition} flip={flip}/>
            </>
        );
    }
};

export default MasterPage;