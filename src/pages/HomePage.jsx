import React from 'react';
import HomeCards from '../components/HomeCards';
import { useNavigate } from "react-router-dom";
import Title from '../components/Title';
import GuestNotice from "../components/GuestNotice";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <>
            <meta
                name="description"
                content="An efficient and easy to use flash card website, with dedicated learning and match modes. Create a set manually or upload a CSV"
            />

            <Title title="Your Sets" />

            <HomeCards />

            <button
                className="lowerRight grnBtn"
                onClick={() => navigate("/landing")}
            >
                Add a set
            </button>
            <GuestNotice />
        </>
    );
};

export default HomePage;
