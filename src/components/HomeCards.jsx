import React from 'react';
import Card from './HomeCard';

const HomeCards = () => {
    var set = new Array(Math.max(localStorage.length-1, 0));
    var lastSize = 0;
    var j = 0;
    for (var i = 0, len = localStorage.length; i < len; ++i) {
        if (localStorage.key(i) != 'darkmode') {
            set[j] = localStorage.key(i);
            j++;
        }
    }
    console.log(set);

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