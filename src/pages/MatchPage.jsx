import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../components/Title';
import MatchCard from '../components/MatchCard';

const MatchPage = () => {
    const { id } = useParams();
    const [flip, setFlip] = useState(false);
    const [index, setIndex] = useState(0);
    const [totalDone, setTotalDone] = useState(0);
    const [set, setOriginalSet] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem(id));
        return storedData ? storedData.set : null;
    });

    const [remainingCards, setRemainingCards] = useState([]);
    const [onDeck, setOnDeck] = useState([]);
    const [currentCards, setCurrentCards] = useState([]);

    const termsToDefs = useRef(new Map());
    const defsToTerms = useRef(new Map());

    const [selectedCard, setSelectedCard] = useState({ content: "", index: "" });

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

    // use to get sort of a better version of ondeck which guarantees matches
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
            setSelectedCard({
                content: content,
                index: index
            });
        } else {
            if (matches(content, selectedCard.content)) {
                remove(index, selectedCard.index);
            } else {

            }

            setSelectedCard({ content: "", index: "" });
        }
    }

    function matches(guess1, guess2) {
        return ((termsToDefs.current.get(guess1) === guess2 && defsToTerms.current.get(guess2) === guess1) || 
                (termsToDefs.current.get(guess2) === guess1 && defsToTerms.current.get(guess1) === guess2));
    }

    function remove(index1, index2) {
        if (onDeck.length == 0) {
            const remainder = remainingCards;
            setOnDeck(generateRandomSixteen(remainder));
            setRemainingCards(remainder);
        }

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
        }
    }

    return (
        <>
            <Title title={id} back="true" />
            <section className='py-4'>
                <div className='container-xl lg:container m-auto'>
                    <div className='grid md:grid-cols-4'>
                        {currentCards.map((content, index) => (
                            <MatchCard key={index} 
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