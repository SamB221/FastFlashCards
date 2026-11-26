import {
    createContext,
    useContext,
    useEffect,
    useState,
    useRef
} from "react";

import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

import { auth, googleProvider } from "./firebase";
import editSet from "./functions/editSet";
import ImportSetsModal from "./components/ImportSetsModal";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [localSets, setLocalSets] = useState([]);

    const offeredUserRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (!currentUser) {
                offeredUserRef.current = null;
                setLocalSets([]);
                setIsLoading(false);
                return;
            }

            // Only offer imports once per sign-in session.
            if (offeredUserRef.current === currentUser.uid) {
                return;
            }

            offeredUserRef.current = currentUser.uid;

            const promptKey = `import-offered-${currentUser.uid}`;

            if (sessionStorage.getItem(promptKey)) {
                setIsLoading(false);
                return;
            }

            const detectedSets = editSet.getLocalSets();

            if (detectedSets.length > 0) {
                sessionStorage.setItem(promptKey, "true");

                setLocalSets(detectedSets);
                setIsLoading(true);
            } else {
                setLocalSets([]);
                setIsLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    async function login() {
        return signInWithPopup(auth, googleProvider);
    }

    async function logout() {
        const uid = auth.currentUser?.uid;

        await signOut(auth);

        if (uid) {
            sessionStorage.removeItem(`import-offered-${uid}`);
        }
    }

    function closeImportModal(uid) {
        if (auth.currentUser?.uid !== uid) return;

        setLocalSets([]);
        setIsLoading(false);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout
            }}
        >
            {children}

            {user && localSets.length > 0 && (
                <ImportSetsModal
                    key={user.uid}
                    user={user}
                    sets={localSets}
                    onClose={() => closeImportModal(user.uid)}
                />
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}
