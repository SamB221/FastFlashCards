import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export function useFlashCardController(id, numLevels) {
    const [set, setSet] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem(id));
        if (!storedData || !Array.isArray(storedData.set)) return [];
        
        const shuffled = [...storedData.set];
        shuffle(shuffled);
        return shuffled;
    });

    const [index, setIndex] = useState(0);
    const [flip, setFlip] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [totalDone, setTotalDone] = useState(0);
    const skipped = useRef(0);
    const [showFeedback, setShowFeedback] = useState("");
    console.log(index);
    var wrong = false;
    const interval = Math.min(10, set.length);

    if (set[index].Mastery >= numLevels) {
        if (skipped.current < set.length) {
            skipped.current++;
            setIndex((index + 1) % set.length);
        }
    } else {
        skipped.current = 0;
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            const tag = document.activeElement.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') return;

            if (set[index].Mastery === 5) return;

            if (totalDone == interval) {
                setTotalDone(0);
                setFlip(false);
            } else if (set[index].Mastery < 2) {
                switch (event.key) {
                    case " ": // Space flips the card
                    case "ArrowUp":
                    case "ArrowDown":
                        event.preventDefault();
                        setFlip(prev => !prev);
                        setCompleted(true);
                        break;

                    case "ArrowRight": // Move to next card if conditions met
                        event.preventDefault();
                        if (completed) {
                            if (
                                flip &&
                                set[(index + 1) % set.length].Mastery < 2 &&
                                totalDone !== interval - 1
                            ) {
                                setFlip(false);
                                setTimeout(nextCard, 50);
                            } else {
                                nextCard();
                            }
                        }
                        break;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [index, totalDone, set, flip]);

    function shuffle(arr) {
        // A Fisher-Yates shuffle
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); 
            [arr[i], arr[j]] = [arr[j], arr[i]];
        } 
    }

    function nextCard() {
        set[index].Mastery = (wrong)? set[index].Mastery - 1 : set[index].Mastery + 1;
        setIndex((index + 1) % set.length);
        setTotalDone(totalDone + 1);
        setCompleted(false);
    }

    function restart() {
        const resetSet = set.map(card => ({ ...card, Mastery: 0 }));
        setSet(resetSet);
        localStorage.setItem(id, JSON.stringify({ set: resetSet }));
        
        skipped.current = 0;
        setIndex(0); 
        setTotalDone(0);
    }

    function generateRandom(exclude) {
        const randomNumbers = new Set();
        while (randomNumbers.size < 3) {
            var randomNumber = Math.floor(Math.random() * (set.length-1));
            while (randomNumber == exclude || randomNumbers.has(randomNumber)) {
                randomNumber = (randomNumber + 1) % set.length;
            }

            randomNumbers.add(randomNumber);
        }

        randomNumbers.add(exclude);

        return [...randomNumbers];
    }

    function testRadio(event, guess, id, correctAnswer) {
        event.preventDefault();
        if (guess === correctAnswer) {
            nextCard();
        } else {
            flashRed(document.getElementById("option" + id));
            wrong = true;
        }
    }

    function flashRed(element) {
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

    async function handleTextForm(e) {
        let guess = document.forms['textForm']['guess'].value;
        document.forms['textForm']['guess'].value = '';
        let definition = set[index].Definition;
        e.preventDefault();
        if (guess.toLowerCase() === definition.toLowerCase()) {
            set[index].Mastery = (wrong)? set[index].Mastery - 1: set[index].Mastery + 1;
            document.getElementById('guess').classList.remove('invalid');
            document.getElementById('noShow').style.display = 'none';
            setIndex((index + 1) % set.length);
            setTotalDone(totalDone + 1);
            wrong = false;
        } else if (await checkWithAI(set[index].Term, guess)) {
            document.getElementById('guess').classList.remove('invalid');
            document.getElementById('noShow').style.display = 'none';
            setShowFeedback(guess);
        } else {
            wrong = true;
            document.getElementById('guess').classList.add('invalid');
            document.getElementById('noShow').style.display = 'block';
        }
    }

    async function checkWithAI(term, guess) {
        if (term.length >= 200 || guess.length >= 200 || guess.length == 0) return false; // too many tokens
        try {
            const res = await fetch("/.netlify/functions/checkTerm", {
                method: "POST",
                body: JSON.stringify({ term, definition: guess }),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                console.error("API error", res.status);
                return false;
            }

            const data = await res.json();

            return data.matches === true;

        } catch (err) {
            console.error("Fetch error", err);
            return false;
        }
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

    function setWrong() {
        wrong = true;
    }

    return {
        set,
        currentIndex: index,
        isFlipped: flip,
        totalDone,
        interval,
        setWrong,
        allDone: skipped.current >= set.length,
        restart,
        shuffle,
        nextCard,
        randomize: shuffle,
        triggerConfetti,
        setLength: set.length,
        generateRandom,
        testRadio,
        handleTextForm,
        showFeedback,
        setShowFeedback
    };
}

export default useFlashCardController;