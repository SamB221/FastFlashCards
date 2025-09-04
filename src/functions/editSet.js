import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { db } from '../firebase.js';

const editSet = {
    async createSet(name, set, user) {
        if (!user) {
            localStorage.setItem(name, JSON.stringify({ set }));
        } else {
            const setDocRef = doc(db, "users", user.sub, "sets", name);
            await setDoc(setDocRef, {
                set: set,    
            });
        }
    },

    async getSet(name, user) {
        if (!user) {
            const data = JSON.parse(localStorage.getItem(name));
            if (!data || !Array.isArray(data.set)) return [];
            return data.set;
        } else {
            const setRef = doc(db, "users", user.sub, "sets", name);
            const docSnap = await getDoc(setRef);

            if (!docSnap.exists()) {
                return [];
            }

            return docSnap.data().set;
        }
    },

    async getSets(user) {
        if (!user) {
            var sets = new Array(Math.max(localStorage.length-1, 0));
            for (var i = 0, len = localStorage.length; i < len; ++i) {
                var key = localStorage.key(i);

                try {
                    const value = localStorage.getItem(key);
                    const parsed = JSON.parse(value);
                    if (parsed && Array.isArray(parsed.set)) {
                        sets.push({ name: key, length: parsed.set.length });
                    }
                } catch (e) {
                    // Invalid JSON, ignore entry
                }
            }

            return sets;
        } else {
            const userDoc = doc(db, "users", user.sub);
            const setsCol = collection(userDoc, "sets");

            const querySnapshot = await getDocs(setsCol);
            const sets = [];
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                sets.push({
                    name: docSnap.id,
                    length: Array.isArray(data.set) ? data.set.length : 0
                });
            });
            return sets;
        }
    }
};

export default editSet;