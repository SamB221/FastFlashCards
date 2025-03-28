import React from 'react';
import Card from './HomeCard';

const HomeCards = () => {
    var set = new Array(localStorage.length);
    var lastSize = 0;
    for (var i = 0, len = set.length; i < len; ++i) {
        set[i] = localStorage.key(i);
    }

    function computeMastery(name) {
        const { set } = JSON.parse(localStorage.getItem(name));
        lastSize = set.length;
        var mastery = 0;
        set.map(n => mastery = (n.Mastery == 5)? mastery+1: mastery);
        return mastery;
    }

    return (
        <section className='py-4'>
            <div className='container-xl lg:container m-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
                {set.map((name, index) => (
                    <Card key={index} setname={name} mastery={computeMastery(name)} totalcards={lastSize} />
                ))}
                </div>
            </div>
        </section>
  );
};
export default HomeCards;