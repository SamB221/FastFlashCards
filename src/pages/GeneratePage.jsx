import { React, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Card from '../components/SetCard';
import Title from '../components/Title';

const GeneratePage = () => {
    const [status, setStatus] = useState("");
    const [set, setSet] = useState([]);

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
            console.log(data.set);
            return data.set;
        } catch (err) {
            console.error("Fetch error", err);
            return false;
        }
    }

    async function handleTextForm(e) {
        const prompt = document.forms['textForm']['prompt'].value;
        e.preventDefault();
        setStatus("awaiting");

        const result = await generate(prompt);

        setStatus("complete");
        setSet(result);
    }

    function goBack() {
        setSet([]);
    }

    function approveSet() {
        localStorage.setItem("test", JSON.stringify({set}));
        navigate("/");
    }

    if (status === "awaiting") {
        return (
            <>
                <Title title="Generate" back="true" />
                <p>Awaiting answer...</p>
            </>
        );
    }
    
    if (set.length > 0) {
        return (
            <>
                <Title title="Generate" back="true" />
                <h1 className="centerText">How does this look?</h1>
                <section className='py-4'>
                    <div className='container-xl lg:container m-auto'>
                        <div className='grid md:grid-cols-4'>
                        {set.map((item, index) => (
                            <div className="miniCard">
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
                <button className="redBtn centerBtn" onClick={goBack}>No, go back</button>
                <button className="grnBtn centerBtn" onClick={approveSet}>Looks good</button>
            </>
        );
    }

    return (
        <>
            <Title title="Generate" back="true" />
            <form className="textForm" autoComplete="off" name="textForm" onSubmit={handleTextForm}>
                <label htmlFor="prompt"><p>Describe the set you would like me to create</p></label>
                <input type="text" className="textInput1" id="prompt" name="firstname" placeholder="Enter a prompt..."></input>
                <input type="submit" value="Generate!"></input>
                <img id="mascot" src="../../../mascot.svg" />
            </form>
        </>
    );
};

export default GeneratePage;