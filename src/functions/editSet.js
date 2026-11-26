import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    runTransaction
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
    },

    getLocalSets() {
        const sets = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            try {
                const data = JSON.parse(localStorage.getItem(key));

                if (data && Array.isArray(data.set)) {
                    sets.push({
                        id: key,
                        name: data.name ?? key,
                        length: data.set.length
                    });
                }
            } catch (error) {
                // Ignore entries that aren't flashcard sets.
            }
        }

        return sets;
    },

    async migrateLocalSets(selectedIds, user) {
        if (!user) {
            throw new Error("You must be signed in to import sets.");
        }

        const imported = [];
        const failed = [];

        for (const localId of selectedIds) {
            try {
                const originalValue = localStorage.getItem(localId);

                if (!originalValue) {
                    throw new Error("Local set no longer exists.");
                }

                const data = JSON.parse(originalValue);

                if (!data || !Array.isArray(data.set)) {
                    throw new Error("Invalid flashcard set.");
                }

                const { id: storedId, ...existingData } = data;

                const cloudData = {
                    ...existingData,
                    name: data.name ?? localId,
                    set: data.set,
                    recordTime: data.recordTime ?? 0
                };

                // Preserve UUIDs for newer sets.
                // Assign safe IDs to older, name-based sets.
                const isSafeId =
                    /^set_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
                        .test(localId);

                const cloudId = isSafeId
                    ? localId
                    : `set_${crypto.randomUUID()}`;

                const setRef = doc(
                    db, "users", user.uid, "sets", cloudId
                );

                const alternativeRef = doc(
                    db,
                    "users",
                    user.uid,
                    "sets",
                    `set_${crypto.randomUUID()}`
                );

                await runTransaction(db, async transaction => {
                    const existing = await transaction.get(setRef);

                    if (!existing.exists()) {
                        transaction.set(setRef, cloudData);
                        return;
                    }

                    // If this ID is already occupied, create a separate
                    // set rather than overwrite the account's copy.
                    const previousImport = existing.data();

                    if (
                        previousImport.name === cloudData.name &&
                        JSON.stringify(previousImport.set) ===
                        JSON.stringify(cloudData.set) &&
                        (previousImport.recordTime ?? 0) ===
                        cloudData.recordTime
                    ) {
                        // An identical set has already been imported.
                        return;
                    }

                    const alternative = await transaction.get(alternativeRef);

                    if (alternative.exists()) {
                        throw new Error("Unable to allocate a unique set ID.");
                    }

                    transaction.set(alternativeRef, cloudData);
                });

                // Only remove the local copy after Firestore succeeds.
                // Don't remove it if another tab changed it during import.
                if (localStorage.getItem(localId) === originalValue) {
                    localStorage.removeItem(localId);
                }

                imported.push(localId);

            } catch (error) {
                console.error("Unable to import set:", localId, error);
                failed.push(localId);
            }
        }

        return { imported, failed };
    },

    async exportSet(id, user) {
        const data = await this.getSetData(id, user);

        if (!data || !Array.isArray(data.set)) {
            throw new Error("Unable to find flashcard set.");
        }

        function escapeCSV(value) {
            const text = String(value ?? "");

            if (/[",\r\n]/.test(text)) {
                return `"${text.replace(/"/g, '""')}"`;
            }

            return text;
        }

        const csv = data.set.map(card =>
            `${escapeCSV(card.Term)},${escapeCSV(card.Definition)}`
        ).join("\r\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        const safeName = data.name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

        link.href = url;
        link.download = `${safeName || "Flashcards"}.csv`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
};

export default editSet;
