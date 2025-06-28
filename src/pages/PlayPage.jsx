import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import Title from '../components/Title';
import {FaRandom} from 'react-icons/fa';
import confetti from 'canvas-confetti';

const PlayPage = () => {
    const { id } = useParams();
    const [flip, setFlip] = useState(false);
    const [index, setIndex] = useState(0);
    const [totalDone, setTotalDone] = useState(0);
    const [set, setOriginalSet] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem(id));
        return storedData ? storedData.set : null;
    });

    function randomize(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function shuffleHelper() {
        if (flip) setFlip(false);
        setIndex(0);

        const shuffled = randomize(set);
        setOriginalSet(shuffled);
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
            <Title title={id} back="true" />
            <div id="cardinfo">
                <p id="cardnumber">{index + 1 + " out of " + set.length}</p>
                <form className="grnBtn" onClick={shuffleHelper}>
                    <input type="button" value="Shuffle" />
                    <FaRandom id="ricon" className="inline text-lg mr-1" />
                </form>
            </div>
            <FlashCard term={set[index].Term} definition={set[index].Definition} flip={flip}/>
        </>
    );
};

export default PlayPage;