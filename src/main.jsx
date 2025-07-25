import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Auth0Provider
            domain='login.fastflashcards.com'
            clientId='zyGAW2XtV76NoQOyNCoumiOSyj1WyHDZ'
            authorizationParams={{ redirect_uri: window.location.origin }}>
                <App />
            </Auth0Provider>
    </StrictMode>,
);