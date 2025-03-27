import React from 'react'
import HomeCards from './components/HomeCards'
import UploadPage from './components/UploadPage'
import Title from './components/Title'
import LowerLeftOptions from './components/LowerLeftOption'

const App = () => {
    if (!localStorage.getItem('set')) {
        return (
            <UploadPage />
        )
    } 

    return (
        <>
            <Title title={localStorage.getItem('setName') || "Default Title"}/>
            <HomeCards />
            <LowerLeftOptions />
        </>
    )
}

export default App;