import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import Spinner from '../components/BoltSpinner';
import { useAuth } from '../AuthContext';
import editSet from '../functions/editSet';

const GeneratePage = () => {
    const { user, isLoading } = useAuth();

    const [status, setStatus] = useState("");
    const [set, setSet] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [setName, setSetName] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const navigate = useNavigate();

    async function generate(prompt) {
        const res = await fetch(
            "/.netlify/functions/generateSet",
            {
                method: "POST",
                body: JSON.stringify(prompt),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (!res.ok) {
            const errorBody = await res.text();

            console.error("API status:", res.status);
            console.error("API response:", errorBody);

            throw new Error("Unable to generate flashcards.");
        }

        const data = await res.json();

        if (!Array.isArray(data.set) || data.set.length === 0) {
            throw new Error("No flashcards were generated.");
        }

        return data.set.map(card => ({
            Term: card.Term,
            Definition: card.Definition,
            Mastery: 0
        }));
    }

    async function handleTextForm(event) {
        event.preventDefault();

        if (!prompt.trim() || status === "awaiting") return;

        setError("");
        setStatus("awaiting");

        try {
            const result = await generate(prompt.trim());

            setSet(result);
            setStatus("complete");
        } catch (error) {
            console.error("Generation failed:", error);

            setStatus("");
            setError(
                "Unable to generate flashcards. Please try again."
            );
        }
    }

    function goBack() {
        setSet([]);
        setStatus("");
        setError("");
    }

    function approveSet() {
        setError("");
        setStatus("naming");
    }

    async function nameSet(event) {
        event.preventDefault();

        if (isLoading || isSaving) return;

        const name = setName.trim();

        if (!name) {
            setError("Please enter a name for your set.");
            return;
        }

        setError("");
        setIsSaving(true);

        try {
            await editSet.createSet(name, set, user);

            navigate("/");
        } catch (error) {
            console.error("Unable to save set:", error);

            setError("Unable to save your set. Please try again.");
        } finally {
            setIsSaving(false);
        }
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

                <form
                    className="textForm"
                    autoComplete="off"
                    name="textForm"
                    onSubmit={nameSet}
                >
                    <label htmlFor="setName">
                        <p>
                            One more step! Let's give it a name
                        </p>
                    </label>

                    <input
                        type="text"
                        className="textInput1"
                        id="setName"
                        name="setName"
                        placeholder="Enter a name..."
                        value={setName}
                        onChange={event =>
                            setSetName(event.target.value)
                        }
                        maxLength={100}
                        disabled={isSaving}
                    />

                    {error && (
                        <p
                            role="alert"
                            style={{
                                color: "#e54848",
                                fontSize: "16px"
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <input
                        className="purple"
                        type="submit"
                        disabled={isLoading || isSaving}
                        value={
                            isSaving ? "Saving..." : "All done!"
                        }
                    />
                </form>
            </>
        );
    }

    if (set.length > 0) {
        return (
            <>
                <Title title="Generate" back="true" />

                <h1 className="centerText">
                    How does this look?
                </h1>

                <p className="centerText">
                    You can edit individual terms after saving
                </p>

                <section className="py-4">
                    <div className="container-xl lg:container m-auto">
                        <div className="grid md:grid-cols-4">
                            {set.map((item, index) => (
                                <div
                                    key={index}
                                    className="miniCard purpleDrop animateCard"
                                    style={{
                                        animationDelay: `${index * 0.04}s`
                                    }}
                                >
                                    <h2
                                        id="term"
                                        className="floatLeft font-bold"
                                    >
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
                    <button
                        className="redBtn dualButtonRow"
                        onClick={goBack}
                    >
                        No, go back
                    </button>

                    <button
                        className="grnBtn dualButtonRow purple"
                        onClick={approveSet}
                    >
                        Looks good
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Title title="Generate" back="true" />

            <form
                className="textForm"
                autoComplete="off"
                name="textForm"
                onSubmit={handleTextForm}
            >
                <label htmlFor="prompt">
                    <p>
                        Describe the set you would like me to create
                    </p>
                </label>

                <input
                    type="text"
                    className="textInput1"
                    id="prompt"
                    name="prompt"
                    placeholder="Enter a prompt..."
                    value={prompt}
                    onChange={event =>
                        setPrompt(event.target.value)
                    }
                />

                {error && (
                    <p
                        role="alert"
                        style={{
                            color: "#e54848",
                            fontSize: "16px"
                        }}
                    >
                        {error}
                    </p>
                )}

                <input
                    className="purple"
                    type="submit"
                    value="Generate!"
                />

                <img
                    id="mascot"
                    src="../../../mascot.svg"
                />
            </form>
        </>
    );
};

export default GeneratePage;
