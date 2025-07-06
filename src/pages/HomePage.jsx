import React, { useEffect } from 'react';
import HomeCards from '../components/HomeCards';
import { useNavigate } from "react-router-dom";
import Title from '../components/Title';

const HomePage = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (numSets() == 0) {
            navigate("/landing");
        }
    }, [navigate]);

    function numSets() {
        let sets = window.localStorage.length;
        if (window.localStorage.getItem('darkmode')) sets--;
        if (window.localStorage.getItem('debug')) sets--;
        return sets;
    }

    function removeSet(e) {
        e.preventDefault();
        navigate("/landing");
    };

    return (
        <>
            <meta name="description" content="An efficient and easy to use flash card website, with dedicated learning and match modes. Create a set manually or upload a CSV"/> 
            <Title title={"Your Sets"} />
            <HomeCards />
            <form className="lowerRight grnBtn" onClick={removeSet}>
                <input id="reset" type="button" value="Add a set"/>
            </form>
        </>
    );
};

export default HomePage;