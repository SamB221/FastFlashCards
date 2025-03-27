import React from 'react';
import HomeCards from '../components/HomeCards';
import UploadPage from '../components/UploadPage';
import Title from '../components/Title';
import LowerRightOption from '../components/LowerRightOption';

const HomePage = () => {
    if (!localStorage.getItem('set')) {
        return (
            <UploadPage />
       );
    } 

    return (
        <>
            <Title title={"Set: "+localStorage.getItem('setName') || "Default Title"}/>
            <HomeCards />
            <LowerRightOption />
        </>
    );
};

export default HomePage;