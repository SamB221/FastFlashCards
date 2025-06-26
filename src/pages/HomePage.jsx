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
        const sets = window.localStorage.length;
        if (window.localStorage.getItem('darkmode')) return sets-1;
        else return sets;
    }

    function removeSet(e) {
        e.preventDefault();
        navigate("/landing");
    };

    return (
        <>
            <Title title={"Your Sets"} />
            <HomeCards />
            <form className="lowerRight grnBtn" onClick={removeSet}>
                <input id="reset" type="button" value="Add a set"/>
            </form>
        </>
    );
};

export default HomePage;