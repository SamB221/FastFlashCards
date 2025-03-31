import React, { useEffect } from 'react';
import HomeCards from '../components/HomeCards';
import { useNavigate } from "react-router-dom";
import Title from '../components/Title';

const HomePage = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (window.localStorage.length === 0) {
            navigate("/upload");
        }
    }, [navigate]);

    function removeSet(e) {
        e.preventDefault();
        navigate("/upload");
    };

    return (
        <>
            <Title title={"Your Sets"} />
            <HomeCards />
            <form className="lowerRightButton">
                <input id="reset" type="button" value="Add a set" onClick={removeSet}/>
            </form>
        </>
    );
};

export default HomePage;