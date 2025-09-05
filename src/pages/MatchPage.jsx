import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../components/Title';
import MatchCard from '../components/MatchCard';
import confetti from 'canvas-confetti';
import { useAuth0 } from "@auth0/auth0-react";
import editSet from '../functions/editSet';

const MatchPage = () => {
    const { user } = useAuth0();
    const [counter, setCounter] = React.useState(0);
    const { id } = useParams();
    const [set, setOriginalSet] = useState([]);

    useEffect(() => {
        const fetchSet = async () => {
            setOriginalSet(await editSet.getSet(id, user));
        };
        fetchSet();
    }, [user]);

    const [remainingCards, setRemainingCards] = useState([]);
    const [currentCards, setCurrentCards] = useState([]);

    const termsToDefs = useRef(new Map());
    const defsToTerms = useRef(new Map());

    const [selectedCard, setSelectedCard] = useState({ content: "", index: "" });
    const [finishedScreen, setFinishedScreen] = useState(false);
    const [progressBar, setProgressBar] = useState(0);

    const timerRef = useRef(null);

    useEffect(() => {
        if (!finishedScreen) {
            timerRef.current = setInterval(() => {
                setCounter(prevCounter => prevCounter + 0.1);
            }, 100);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [finishedScreen]);

    useEffect(() => {
        if (!set) return;

        defineMaps();
        const initialNum = (window.innerWidth <= 600)? 8 : 16;
        var shuffled = randomize([...set]);
        var termsAndDefs = [];
        while (shuffled.length > 0) {
            var currentBatch = [];
            for (let i = 0; i < initialNum / 2 && shuffled.length > 0; i++) {
                const current = shuffled.pop();
                currentBatch.push({ content: current.Term, isTerm: true });
                currentBatch.push({ content: current.Definition, isTerm: false });
            }

            currentBatch = randomize(currentBatch);
            termsAndDefs.push(...currentBatch);
        }

        setCurrentCards(termsAndDefs.splice(0, initialNum));
        setRemainingCards(termsAndDefs);
    }, [set]);

    function defineMaps() {
        for (let i = 0; i < set.length; i++) {
            var current = set[i];
            termsToDefs.current.set(current.Term, current.Definition);
            defsToTerms.current.set(current.Definition, current.Term);
        }
    }

    function randomize(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function onClick(content, index) {
        if (selectedCard.content == "") {
            setSelectedCard({ content: content, index: index });
        } else if (selectedCard.content === content) {
            setSelectedCard({ content: "", index: "" });
        } else if (match(content, selectedCard.content)) {
            remove(index, selectedCard.index);
            setSelectedCard({ content: "", index: "" });
        } else { // wrong guess
            flashRed(index);
            flashRed(selectedCard.index);
            setSelectedCard({ content: "", index: "" });
        }
    }

    function match(guess1, guess2) {
        return ((termsToDefs.current.get(guess1) === guess2 && defsToTerms.current.get(guess2) === guess1) || 
                (termsToDefs.current.get(guess2) === guess1 && defsToTerms.current.get(guess1) === guess2));
    }

    function remove(index1, index2) {
        const updatedCards = [...currentCards];
        updatedCards[index1] = null;
        updatedCards[index2] = null;
        setCurrentCards(updatedCards);

        const activeCards = updatedCards.filter(card => card !== null).length;

        if (activeCards === 0) {
            const nextBatchSize = Math.min(currentCards.length, remainingCards.length);
            if (nextBatchSize === 0) {
                setFinishedScreen(true);
                triggerConfetti();
            } else {
                setCurrentCards(remainingCards.slice(0, nextBatchSize));
                setRemainingCards(prevDeck => prevDeck.slice(nextBatchSize));
            }
        }
            
        setProgressBar(1-(remainingCards.length+activeCards)/(set.length*2));
    }

    function flashRed(id) {
        let element = document.getElementById(id);
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

    if (finishedScreen) {
        return (
            <>
                <Title title={id} back="true" />
                <div className="feedbackBox padBottom2">
                    <h1 className="centerText pad1 white">Great job! You finished in {counter.toFixed(1)} seconds</h1>
                    <button className="centerBtn grnBtn" aria-label="restart" type="button" onClick={reset}>
                        Again!
                    </button>
                </div>
            </>
        );
    }

    function reset() {
        setCounter(0);
        setFinishedScreen(false);
        const storedData = JSON.parse(localStorage.getItem(id));
        setOriginalSet(storedData.set);
        setProgressBar(0);
    }

    return (
        <>
            <Title title={id} back="true" />
            <div className="centerText">
                <p>{counter.toFixed(1)}</p>
                <progress className="centerText progressBar" value={progressBar} />
            </div>
            <section className='py-4'>
                <div className='container-xl lg:container m-auto'>
                    <div className='grid md:grid-cols-4'>
                        {currentCards.map((card, index) => (
                            <MatchCard key={index}
                            id={index} 
                            content={card ? card.content : null}
                            isTerm={card ? card.isTerm : null}
                            isSelected={selectedCard.index === index}
                            onClick={() => onClick(card?.content, index)}/>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default MatchPage;