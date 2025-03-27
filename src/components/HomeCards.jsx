import React from 'react';
import Card from './Card';

const HomeCards = () => {
    const { set } = JSON.parse(localStorage.getItem('set'));
    return (
        <section className='py-4'>
            <div className='container-xl lg:container m-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
                {set.map((item, index) => (
                    <Card key={index} term={item.Term} definition={item.Definition} mastery={item.Mastery} />
                ))}
                </div>
            </div>
        </section>
  );
};
export default HomeCards;