import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc
} from "firebase/firestore";

import { db } from '../firebase.js';

const editSet = {

    async createSet(setName, set, user) {
        const id = `set_${crypto.randomUUID()}`;

        const data = {
            name: setName.trim(),
            set: set,
            recordTime: 0
        };

        if (!data.name) {
            throw new Error("Set name cannot be empty.");
        }

        if (!user) {
            localStorage.setItem(id, JSON.stringify(data));
        } else {
            const setRef = doc(db, "users", user.uid, "sets", id);
            await setDoc(setRef, data);
        }

        return id;
    },

    async getSetData(id, user) {
        if (!user) {
            const data = JSON.parse(localStorage.getItem(id));

            if (!data || !Array.isArray(data.set)) {
                return null;
            }

            return {
                ...data,
                id: id,
                name: data.name ?? id
            };
        } else {
            const setRef = doc(db, "users", user.uid, "sets", id);
            const docSnap = await getDoc(setRef);

            if (!docSnap.exists()) {
                return null;
            }

            const data = docSnap.data();

            return {
                ...data,
                id: docSnap.id,
                name: data.name ?? docSnap.id
            };
        }
    },

    async getSet(id, user) {
        const data = await this.getSetData(id, user);

        return data?.set ?? [];
    },

    async getSets(user) {
        const sets = [];

        if (!user) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);

                try {
                    const parsed = JSON.parse(localStorage.getItem(key));

                    if (parsed && Array.isArray(parsed.set)) {
                        sets.push({
                            id: key,
                            name: parsed.name ?? key,
                            length: parsed.set.length
                        });
                    }
                } catch (error) {
                    // Not a flashcard set, ignore it.
                }
            }
        } else {
            const setsCol = collection(
                db, "users", user.uid, "sets"
            );

            const querySnapshot = await getDocs(setsCol);

            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();

                sets.push({
                    id: docSnap.id,
                    name: data.name ?? docSnap.id,
                    length: Array.isArray(data.set)
                        ? data.set.length
                        : 0
                });
            });
        }

        return sets;
    },

    async updateSet(id, setName, set, user) {
        const name = setName.trim();

        if (!name) {
            throw new Error("Set name cannot be empty.");
        }

        if (!user) {
            const data = await this.getSetData(id, user);

            if (!data) {
                throw new Error("Set does not exist.");
            }

            const { id: storedId, ...existingData } = data;

            localStorage.setItem(id, JSON.stringify({
                ...existingData,
                name: name,
                set: set
            }));
        } else {
            const setRef = doc(db, "users", user.uid, "sets", id);

            await updateDoc(setRef, {
                name: name,
                set: set
            });
        }
    },

    async deleteSet(id, user) {
        if (!user) {
            localStorage.removeItem(id);
        } else {
            const setRef = doc(db, "users", user.uid, "sets", id);
            await deleteDoc(setRef);
        }
    },

    async setRecord(id, user, time) {
        if (!user) {
            const data = await this.getSetData(id, user);

            if (!data) return;

            const { id: storedId, ...existingData } = data;

            localStorage.setItem(id, JSON.stringify({
                ...existingData,
                recordTime: time
            }));
        } else {
            const setRef = doc(db, "users", user.uid, "sets", id);

            await updateDoc(setRef, {
                recordTime: time
            });
        }
    }
};

export default editSet;
