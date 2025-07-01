import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../components/Title';
import MatchCards from '../components/MatchCards';

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

    useEffect(() => {
        if (!set) return;

        const shuffled = randomize(set);

        const termsAndDefs = [];
        for (let i = 0; i < 8; i++) {
            var current = shuffled.pop();
            termsAndDefs.push(current.Term);
            termsAndDefs.push(current.Definition);
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

    return (
        <>
            <Title title={id} back="true" />
            <MatchCards set={currentCards} />
        </>
    );
};

export default MatchPage;