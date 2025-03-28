import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import FlashCard from '../components/FlashCard';

const PlayPage = () => {
    const { id } = useParams();
    var { set } = JSON.parse(localStorage.getItem(id));
    //var keypress = new KeyboardEvent();
    const [flip, setFlip] = useState(false);
    
    useEffect(() => {
        // Set up the event listener inside useEffect
        const handleKeyDown = (event) => {
            if (event.key === " ") {
                setFlip(prevFlip => !prevFlip); // Toggle flip state
                console.log(!flip);  // Optional: Check if flip state is toggling correctly
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [flip]);

    return (
        <FlashCard term={set[1].Term} definition={set[1].Definition} flip={flip}/>
    );
};

export default PlayPage;