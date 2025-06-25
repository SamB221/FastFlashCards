import React from 'react';
import Card from './HomeCard';

const HomeCards = () => {
    var set = new Array(Math.max(localStorage.length-1, 0));
    for (var i = 0, len = localStorage.length; i < len; ++i) {
        var key = localStorage.key(i);

        try {
            const value = localStorage.getItem(key);
            const parsed = JSON.parse(value);
            if (parsed && Array.isArray(parsed.set)) {
                set.push({ name: key, length: parsed.set.length });
            }
        } catch (e) {
            // Invalid JSON, ignore entry
        }
    }

    return (
        <section className='py-4'>
            <div className='container-xl lg:container m-auto'>
                <div className='grid md:grid-cols-2'>
                {set.map(({ name, length }) => (
                    <Card key={name} setname={name} totalcards={length} />
                ))}
                </div>
            </div>
        </section>
  );
};
export default HomeCards;