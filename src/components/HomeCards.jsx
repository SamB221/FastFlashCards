import React, { useEffect, useState } from 'react';
import Card from './HomeCard';
import { useAuth } from "../AuthContext";
import editSet from '../functions/editSet';

const HomeCards = () => {
    const { user } = useAuth();
    const [sets, setSets] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            setSets(await editSet.getSets(user));
        };
        fetchData();
    }, [user]);

    return (
        <section className='py-4'>
            <div className='container-xl lg:container m-auto'>
                <div className='grid md:grid-cols-4'>
                {sets.map(({ name, length }) => (
                    <Card key={name} setname={name} totalcards={length} />
                ))}
                </div>
            </div>
        </section>
    );
};
export default HomeCards;
