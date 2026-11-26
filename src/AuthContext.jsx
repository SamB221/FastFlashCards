import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback
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
    const [authState, setAuthState] = useState({
        user: null,
        isLoading: true,
        localSets: []
    });

    const { user, isLoading, localSets } = authState;

    // Handle both restored sessions and new sign-ins.
    const handleAuthUser = useCallback((currentUser) => {
        if (!currentUser) {
            setAuthState({
                user: null,
                isLoading: false,
                localSets: []
            });

            return;
        }

        const promptKey = `import-offered-${currentUser.uid}`;

        let detectedSets = [];

        if (!sessionStorage.getItem(promptKey)) {
            detectedSets = editSet.getLocalSets();
        }

        setAuthState(previous => {
            // Preserve an import modal that is already open.
            if (
                previous.user?.uid === currentUser.uid &&
                previous.localSets.length > 0
            ) {
                return previous;
            }

            return {
                user: currentUser,
                isLoading: detectedSets.length > 0,
                localSets: detectedSets
            };
        });
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            handleAuthUser
        );

        return unsubscribe;
    }, [handleAuthUser]);

    async function login() {
        const result = await signInWithPopup(
            auth,
            googleProvider
        );

        // Explicitly check for local sets after popup sign-in.
        if (auth.currentUser?.uid === result.user.uid) {
            handleAuthUser(result.user);
        }

        return result;
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

        // Only mark the prompt as handled once it is closed.
        sessionStorage.setItem(`import-offered-${uid}`, "true");

        setAuthState(previous => ({
            ...previous,
            localSets: [],
            isLoading: false
        }));
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
