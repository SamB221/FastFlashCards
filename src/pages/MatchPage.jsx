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

    const [onDeck, setOnDeck] = useState([]);
    const [currentCards, setCurrentCards] = useState([]);

    const termsToDefs = useRef(new Map());
    const defsToTerms = useRef(new Map());

    const [selectedCard, setSelectedCard] = useState(null);
    const lastGuess = useRef("");

    useEffect(() => {
        if (!set) return;

        const shuffled = randomize(set);

        const termsAndDefs = [];
        for (let i = 0; i < 8; i++) {
            var current = shuffled.pop();
            termsAndDefs.push(current.Term);
            termsAndDefs.push(current.Definition);

            termsToDefs.current.set(current.Term, current.Definition);
            defsToTerms.current.set(current.Definition, current.Term);
        }

        setOnDeck(shuffled);
        setCurrentCards(termsAndDefs);
    }, [set]);

    function randomize(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function onClick(content) {
        if (lastGuess.current == "") {
            lastGuess.current = content;
            setSelectedCard(content)
        } else {
            console.log(content);
            console.log(lastGuess.current);
            if (matches(content, lastGuess.current)) {
                alert("correct");
            } else {
                alert("incorrect");
            }

            lastGuess.current = "";
            setSelectedCard(null);
        }
    }

    function matches(guess1, guess2) {
        return ((termsToDefs.current.get(guess1) === guess2 && defsToTerms.current.get(guess2) === guess1) || 
                (termsToDefs.current.get(guess2) === guess1 && defsToTerms.current.get(guess1) === guess2));
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
                            isSelected={selectedCard === content}
                            onClick={() => onClick(content)}/>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default MatchPage;