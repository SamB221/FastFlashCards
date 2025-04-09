import React from 'react';
import Card from './HomeCard';

const HomeCards = () => {
    var set = new Array(Math.max(localStorage.length-1, 0));
    var j = 0;
    for (var i = 0, len = localStorage.length; i < len; ++i) {
        if (localStorage.key(i) != 'darkmode') {
            set[j] = localStorage.key(i);
            j++;
        }
    }

    function findLength(name) {
        const { set } = JSON.parse(localStorage.getItem(name));
        return set.length;
    }

    return (
        <section className='py-4'>
            <div className='container-xl lg:container m-auto'>
                <div className='grid md:grid-cols-2'>
                {set.map((name) => (
                    <Card setname={name} totalcards={findLength(name)} />
                ))}
                </div>
            </div>
        </section>
  );
};
export default HomeCards;