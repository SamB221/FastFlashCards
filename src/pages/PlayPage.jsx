import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import UIBar from '../components/UIBar';
import {FaRandom} from 'react-icons/fa';
import confetti from 'canvas-confetti';
import './PlayPage.css'

const PlayPage = () => {
    const { id } = useParams();
    const [flip, setFlip] = useState(false);
    const [index, setIndex] = useState(0);
    const [totalDone, setTotalDone] = useState(0);
    const [sortedSet, setSortedSet] = useState("init");
    var { set } = JSON.parse(localStorage.getItem(id));

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

    function randomizeHelper() {
        if (flip) setFlip(false);
        setIndex(0);
        randomize();
    }

    function switchRight() {
        if (index == set.length-1 && totalDone > set.length-2) triggerConfetti();
        setIndex((index + 1) % set.length);
        setTotalDone(totalDone + 1);
    }

    function switchLeft() {
        if (flip) setFlip(false);
        if (index > 0) setIndex(index - 1);
        else setIndex(set.length - 1);
        setTotalDone(totalDone + 1);
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
            } else if (event.key === "ArrowLeft") {
                if (flip) {
                    setFlip(false)
                    setTimeout(switchLeft, 50); // Without delay when flipping, people could cheat!
                } else {
                    switchLeft();
                }
            } else if (event.key === "ArrowRight") {
                if (flip) {
                    setFlip(false);
                    setTimeout(switchRight, 50); // Without delay when flipping, people could cheat!
                } else {
                    switchRight();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [flip, index]);

    return (
        <>
            <UIBar title={id} option="Back" location=""/>
            <div id="cardinfo">
                <p id="cardnumber">{index + 1 + " out of " + set.length}</p>
                <form id="randomizebutton" onClick={randomizeHelper}>
                    <input type="button" value="Randomize" />
                    <FaRandom id="ricon" className="inline text-lg mr-1" />
                </form>
            </div>
            <FlashCard term={sortedSet[index].Term} definition={sortedSet[index].Definition} flip={flip}/>
        </>
    );
};

export default PlayPage;