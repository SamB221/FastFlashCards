import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FlashCard from '../components/FlashCard';

const PlayPage = () => {
    const { id } = useParams();
    const [flip, setFlip] = useState(false);
    const [index, setIndex] = useState(0);
    const [sortedSet, setSortedSet] = useState("init");
    var { set } = JSON.parse(localStorage.getItem(id));

    if (sortedSet === "init") {
        fisherYatesShuffle(set);
        setSortedSet(set);
    } 


    function fisherYatesShuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); 
            [arr[i], arr[j]] = [arr[j], arr[i]];
        } 
    }
    
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === " "|| event.key === "ArrowUp" || event.key === "ArrowDown") {
                setFlip(!flip);
            } else if (event.key === "ArrowLeft") {
                if (flip) setFlip(false);
                if (index > 0) setIndex(index - 1);
                else setIndex(set.length - 1);
            } else if (event.key === "ArrowRight") {
                if (flip) setFlip(false);
                setIndex((index + 1) % set.length);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [flip, index]);

    return (
        <FlashCard term={sortedSet[index].Term} definition={sortedSet[index].Definition} flip={flip}/>
    );
};

export default PlayPage;