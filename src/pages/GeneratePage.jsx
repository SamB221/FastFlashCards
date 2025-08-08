import { React, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import Spinner from '../components/BoltSpinner';
import { useAuth0 } from "@auth0/auth0-react";
import editSet from '../functions/editSet';

const GeneratePage = () => {
    const { user } = useAuth0();
    const [status, setStatus] = useState("");
    const [set, setSet] = useState([]);
    const [prevPrompt, setPrevPrompt] = useState("");

    const navigate = useNavigate();

    async function generate(prompt) {
        try {
            const res = await fetch("/.netlify/functions/generateSet", {
                method: "POST",
                body: JSON.stringify(prompt),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                console.error("API error", res.status);
                return false;
            }

            const data = await res.json();
            return data.set;
        } catch (err) {
            console.error("Fetch error", err);
            return false;
        }
    }

    async function handleTextForm(e) {
        const prompt = document.forms['textForm']['prompt'].value;
        e.preventDefault();
        if (prompt === "") return;
        setStatus("awaiting");

        const result = await generate(prompt);

        setStatus("complete");
        setSet(result);
        setPrevPrompt(prompt);
    }

    async function goBack() {
        await setSet([]);
        document.forms['textForm']['prompt'].value = prevPrompt;
    }

    function approveSet() {
        setStatus("naming");
    }

    function nameSet(event) {
        event.preventDefault();
        const name = document.forms['textForm']['prompt'].value;
        editSet.createSet(name, set, user);
        navigate("/");
    }

    if (status === "awaiting") {
        return (
            <>
                <Title title="Generate" back="true" />
                <Spinner />
            </>
        );
    }

    if (status === "naming") {
        return (
        <>
            <Title title="Generate" back="true" />
            <form className="textForm" autoComplete="off" name="textForm" onSubmit={nameSet}>
                <label htmlFor="prompt"><p>One more step! Let's give it a name</p></label>
                <input type="text" className="textInput1" id="prompt" name="firstname" placeholder="Enter a name..."></input>
                <input className="purple" type="submit" value="All done!"></input>
            </form>
        </>
        );
    }
    
    if (set.length > 0) {
        return (
            <>
                <Title title="Generate" back="true" />
                <h1 className="centerText">How does this look?</h1>
                <p className="centerText">You can edit individual terms after saving </p>
                <section className='py-4'>
                    <div className='container-xl lg:container m-auto'>
                        <div className='grid md:grid-cols-4'>
                        {set.map((item, index) => (
                            <div key={index} 
                                className="miniCard purpleDrop animateCard" 
                                style={{ animationDelay: `${index * 0.04}s` }}>
                                <h2 id="term" className='floatLeft font-bold'>
                                    {item.Term}
                                </h2>
                                <br />
                                <p id="cardCount">
                                    {item.Definition}
                                </p>
                            </div>
                        ))}
                        </div>
                    </div>
                </section>
                <div className="dualButtonsRow pad1">
                    <button className="redBtn dualButtonRow" onClick={goBack}>No, go back</button>
                    <button className="grnBtn dualButtonRow purple" onClick={approveSet}>Looks good</button>
                </div>
            </>
        );
    }

    return (
        <>
            <Title title="Generate" back="true" />
            <form className="textForm" autoComplete="off" name="textForm" onSubmit={handleTextForm}>
                <label htmlFor="prompt"><p>Describe the set you would like me to create</p></label>
                <input type="text" className="textInput1" id="prompt" name="firstname" placeholder="Enter a prompt..."></input>
                <input className="purple" type="submit" value="Generate!"></input>
                <img id="mascot" src="../../../mascot.svg" />
            </form>
        </>
    );
};

export default GeneratePage;