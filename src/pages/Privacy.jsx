import React from "react";
import Title from "../components/Title";

const Privacy = () => {
    return (
        <>
            <Title title="Privacy Policy" back="true" />

            <main className="privacyPage">
                <p className="privacyDate">
                    Last updated: November 26, 2026
                </p>

                <p>
                    FastFlashcards is an independent educational website
                    that helps users create, generate, and study flashcards.
                    This policy explains what information we collect and
                    how we use it.
                </p>

                <h2>Information We Collect</h2>

                <p>
                    When you sign in with Google, FastFlashcards receives
                    basic account information, including your name, email
                    address, profile picture, and a unique account identifier.
                    This information is used to authenticate your account
                    and associate your saved flashcards with it.
                </p>

                <p>
                    We also store flashcard sets and associated study data
                    that you save to your account.
                </p>

                <p>
                    FastFlashcards does not access your Google Drive,
                    Gmail, contacts, or other unrelated Google account data.
                </p>

                <h2>How We Use Your Information</h2>

                <p>
                    We use your information to provide and maintain
                    FastFlashcards, including:
                </p>

                <ul>
                    <li>Authenticating and managing your account.</li>
                    <li>Saving and retrieving your flashcard sets.</li>
                    <li>Remembering your website preferences.</li>
                    <li>Maintaining and improving website functionality.</li>
                </ul>

                <p>
                    We do not sell your personal information or use your
                    Google account information for advertising.
                </p>

                <h2>AI-Generated Flashcards</h2>

                <p>
                    When you use the AI flashcard generation feature,
                    your submitted prompt is sent to OpenAI to generate
                    flashcard content.
                </p>

                <p>
                    Submitted prompts and generated content may be retained
                    or used by OpenAI to improve its models, depending on
                    applicable data-sharing settings.
                </p>

                <p>
                    Your Google account information is not intentionally
                    included in these requests. Please avoid submitting
                    sensitive, confidential, or personally identifiable
                    information through the AI generation feature.
                </p>

                <h2>Third-Party Services</h2>

                <p>
                    FastFlashcards relies on the following third-party
                    services to operate:
                </p>

                <ul>
                    <li>
                        <strong>Google Firebase:</strong> Authentication
                        and database storage.
                    </li>
                    <li>
                        <strong>OpenAI:</strong> AI-powered flashcard
                        generation.
                    </li>
                    <li>
                        <strong>Netlify:</strong> Website hosting and
                        backend functionality.
                    </li>
                </ul>

                <p>
                    These services process information necessary to provide
                    their respective functionality and are subject to
                    their own privacy policies.
                </p>

                <h2>Browser Storage</h2>

                <p>
                    FastFlashcards uses browser storage to remember
                    preferences, such as your selected website theme,
                    and to maintain your authentication session.
                </p>

                <h2>Data Retention and Deletion</h2>

                <p>
                    Account information and saved flashcards are retained
                    while your account remains active, unless deleted
                    earlier.
                </p>

                <p>
                    You may request access to or deletion of your account
                    and associated information by contacting us at the
                    email address below.
                </p>

                <h2>Data Security</h2>

                <p>
                    FastFlashcards uses authentication and access controls
                    intended to protect your account and stored information.
                    However, no method of electronic storage or transmission
                    can be guaranteed to be completely secure.
                </p>

                <h2>Changes to This Policy</h2>

                <p>
                    This privacy policy may be updated as FastFlashcards
                    evolves. Changes will be reflected on this page,
                    along with the updated revision date.
                </p>
            </main>
        </>
    );
};

export default Privacy;
