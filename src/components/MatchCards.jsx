import React from 'react';
import MatchCard from './MatchCard';

const MatchCards = ({set}) => {
    return (
        <section className='py-4'>
            <div className='container-xl lg:container m-auto'>
                <div className='grid md:grid-cols-4'>
                {set.map((item, index) => (
                    <MatchCard key={index} content={item}/>
                ))}
                </div>
            </div>
        </section>
  );
};
export default MatchCards;