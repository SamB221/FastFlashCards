import React from 'react';
import {Link} from 'react-router-dom';

const GeneratePage = () => {
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

    return (
        <>
            <p>Test</p>
        </>
    );
};

export default GeneratePage;