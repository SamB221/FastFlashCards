import React from 'react';
import Card from './SetCard';

const SetCards = ({setname}) => {
    const { set } = JSON.parse(localStorage.getItem(setname));
    return (
        <section className='py-4 padBottom8'>
            <div className='container-xl lg:container m-auto'>
                <div className='grid md:grid-cols-2'>
                {set.map((item, index) => (
                    <Card key={index} term={item.Term} definition={item.Definition} mastery={item.Mastery} />
                ))}
                </div>
            </div>
        </section>
  );
};
export default SetCards;