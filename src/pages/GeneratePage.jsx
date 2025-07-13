import { React, useState } from 'react';
import {Link} from 'react-router-dom';

const GeneratePage = () => {
    const [status, setStatus] = useState("");

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
        let prompt = document.forms['textForm']['prompt'].value;
        e.preventDefault();
        setStatus("awaiting");

        const result = await generate(prompt);
        console.log(result);

        setStatus("completed");
    }

    if (status === "awaiting") {
        return (
            <p>Awaiting answer...</p>
        );
    }
    
    if (status === "completed") {
        return (
            <p>Done!</p>
        );
    }

    return (
        <>
            <form className="textForm" autoComplete="off" name="textForm" onSubmit={handleTextForm}>
                <label htmlFor="prompt"><p>Describe the set you would like me to create</p></label>
                <input type="text" className="textInput1" id="prompt" name="firstname" placeholder="Enter a prompt..."></input>
                <input type="submit" value="Generate!"></input>
            </form>
        </>
    );
};

export default GeneratePage;