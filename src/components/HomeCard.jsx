import React from 'react';
import {Link} from 'react-router-dom';

const HomeCard = ({ setname, mastery = '', totalcards, bg = 'bg-gray-100' }) => {
    return (
        <Link id="link" className="active" to={"/set/" + setname}>
            <div className={`${bg} p-6 rounded-lg shadow-md`}>
                <h2 className='float-left text-2xl font-bold'>
                    {setname}
                </h2>
                <p className='float-right mt-2 mb-4 text-2xl' id="masterylevel">
                    {"Cards: " + totalcards}
                </p>
                <br />
                <p className='mt-2 mb-4'>
                    {mastery}
                </p>
            </div>
        </Link>
    );
};

export default HomeCard;