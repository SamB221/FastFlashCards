import React from 'react';
import Card from './SetCard';

const MatchCards = ({set}) => {
    return (
        <section className='py-4'>
            <div className='container-xl lg:container m-auto'>
                <div className='grid md:grid-cols-4'>
                {set.map((item, index) => (
                    <Card key={index} term={item.Term} definition={item.Definition} mastery={item.Mastery} />
                ))}
                </div>
            </div>
        </section>
  );
};
export default MatchCards;