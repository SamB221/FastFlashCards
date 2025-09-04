import React, { useEffect, useState } from 'react';
import Card from './SetCard';
import { useAuth0 } from "@auth0/auth0-react";
import editSet from '../functions/editSet';

const SetCards = ({setname}) => {
    const { user } = useAuth0();
    const [set, setSet] = useState([]);
    
    useEffect(() => {
        const fetchSet = async () => {
            setSet(await editSet.getSet(setname, user));
        };
        fetchSet();
        console.log(set);
    }, [user]);

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