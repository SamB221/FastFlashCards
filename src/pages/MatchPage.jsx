import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../components/Title';
import MatchCard from '../components/MatchCard';

const MatchPage = () => {
    const [counter, setCounter] = React.useState(0);
    const { id } = useParams();
    const [set, setOriginalSet] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem(id));
        return storedData ? storedData.set : null;
    });

    const [remainingCards, setRemainingCards] = useState([]);
    const [onDeck, setOnDeck] = useState([]);
    const [currentCards, setCurrentCards] = useState([]);
    const nullSpots = useRef(0);

    const termsToDefs = useRef(new Map());
    const defsToTerms = useRef(new Map());

    const [selectedCard, setSelectedCard] = useState({ content: "", index: "" });


    useEffect(() => {
        const timer = counter < 100000 && setInterval(() => {
            setCounter(prevCounter => prevCounter + 0.1); // Increment by 100ms
        }, 100); // Interval set to 100ms to update the counter every 100ms

        return () => clearInterval(timer);
    }, [counter]);

    useEffect(() => {
        if (!set) return;

        defineMaps();
        const shuffled = randomize([...set]);

        const newCurrentCards = generateRandomSixteen(shuffled);
        const newOnDeck = generateRandomSixteen(shuffled);
        const newRemainingCards = shuffled;

        setCurrentCards(newCurrentCards);
        setOnDeck(newOnDeck);
        setRemainingCards(newRemainingCards);
    }, [set]);

    useEffect(() => {
        if (onDeck.length === 0 && remainingCards.length > 0) {
            const newDeck = generateRandomSixteen(remainingCards);
            setOnDeck(newDeck);
            setRemainingCards(remainingCards.filter(card => !newDeck.includes(card)));
        }
    }, [onDeck, remainingCards]);

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

    function generateRandomSixteen(arr) {
        const termsAndDefs = [];
        for (let i = 0; i < 8; i++) {
            if (arr.length > 0) {
                var current = arr.pop();
                termsAndDefs.push(current.Term);
                termsAndDefs.push(current.Definition);
            }
        }

        return randomize(termsAndDefs);
    }

    function onClick(content, index) {
        if (selectedCard.content == "") {
            setSelectedCard({ content: content, index: index });
        } else if (selectedCard.content === content) {
            setSelectedCard({ content: "", index: "" });
        } else if (matches(content, selectedCard.content)) {
            remove(index, selectedCard.index);
            setSelectedCard({ content: "", index: "" });
        } else { // wrong guess
            flashRed(index);
            flashRed(selectedCard.index);
            setSelectedCard({ content: "", index: "" });
        }
    }

    function matches(guess1, guess2) {
        return ((termsToDefs.current.get(guess1) === guess2 && defsToTerms.current.get(guess2) === guess1) || 
                (termsToDefs.current.get(guess2) === guess1 && defsToTerms.current.get(guess1) === guess2));
    }

    function remove(index1, index2) {
        if (onDeck.length > 0) {
            const addition1 = onDeck[onDeck.length - 2];
            const addition2 = onDeck[onDeck.length - 1];

            setCurrentCards(prevCards => {
                const newCards = [...prevCards];
                newCards[index1] = addition1;
                newCards[index2] = addition2;
                return newCards;
            });

            setOnDeck(prevDeck => prevDeck.slice(0, prevDeck.length - 2));
        } else {
            currentCards[index1] = null;
            currentCards[index2] = null;
            nullSpots.current += 2;
        }

        if (nullSpots.current == 16) {
            // done
        }
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

    return (
        <>
            <Title title={id} back="true" />
            <div className="centerText"><p>{counter.toFixed(1)}</p></div>
            <section className='py-4'>
                <div className='container-xl lg:container m-auto'>
                    <div className='grid md:grid-cols-4'>
                        {currentCards.map((content, index) => (
                            <MatchCard key={index}
                            id={index} 
                            content={content} 
                            isSelected={selectedCard.content === content}
                            onClick={() => onClick(content, index)}/>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default MatchPage;