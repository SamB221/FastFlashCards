import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './HomeCard';
import { useAuth } from "../AuthContext";
import editSet from '../functions/editSet';

const HomeCards = () => {
    const { user, isLoading } = useAuth();
    const [sets, setSets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;

        let cancelled = false;

        const fetchData = async () => {
            try {
                const result = await editSet.getSets(user);

                if (cancelled) return;

                setSets(result);

                if (result.length === 0) {
                    navigate("/landing");
                }
            } catch (error) {
                console.error("Failed to retrieve sets:", error);
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [user, isLoading, navigate]);

    return (
        <section className='py-4'>
            <div className='container-xl lg:container m-auto'>
                <div className='grid md:grid-cols-4'>
                    {sets.map(({ id, name, length }) => (
                        <div
                            key={id}
                            className="homeCardEnter"
                            style={{
                                animationDelay: `${Math.min(id, 10) * 70}ms`
                            }}
                        >
                            <Card
                                key={id}
                                setid={id}
                                setname={name}
                                totalcards={length}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeCards;
