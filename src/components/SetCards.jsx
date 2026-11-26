import React, { useEffect, useState } from 'react';
import Card from './SetCard';
import { useAuth } from "../AuthContext";
import editSet from '../functions/editSet';

const SetCards = ({ setname, cards, animate = false }) => {
    const { user, isLoading } = useAuth();
    const [set, setSet] = useState([]);

    useEffect(() => {
        // No database request needed if cards are provided.
        if (cards !== undefined || isLoading) return;

        let cancelled = false;

        const fetchSet = async () => {
            try {
                const data = await editSet.getSet(setname, user);

                if (!cancelled) {
                    setSet(data);
                }
            } catch (error) {
                console.error("Unable to retrieve cards:", error);
            }
        };

        fetchSet();

        return () => {
            cancelled = true;
        };
    }, [user, setname, cards, isLoading]);

    const displayedCards = cards ?? set;

    return (
        <section className="py-4 padBottom8">
            <div className="container-xl lg:container m-auto">
                <div className="grid md:grid-cols-2">
                    {displayedCards.map((item, index) => (
                        <div
                            key={index}
                            className={animate ? "staggeredCard" : ""}
                            style={animate ? {
                                animationDelay: `${Math.min(index, 20) * 90}ms`
                            } : undefined}
                        >
                            <Card
                                term={item.Term}
                                definition={item.Definition}
                                mastery={item.Mastery}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SetCards;
