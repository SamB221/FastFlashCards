import React, { useState } from 'react';
import editSet from '../functions/editSet';

const ImportSetsModal = ({ user, sets, onClose }) => {
    const [remainingSets, setRemainingSets] = useState(sets);

    const [selected, setSelected] = useState(
        () => new Set(sets.map(set => set.id))
    );

    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState("");

    const allSelected =
        remainingSets.length > 0 &&
        selected.size === remainingSets.length;

    function toggleSet(id) {
        setSelected(previous => {
            const updated = new Set(previous);

            if (updated.has(id)) {
                updated.delete(id);
            } else {
                updated.add(id);
            }

            return updated;
        });
    }

    function toggleAll() {
        if (allSelected) {
            setSelected(new Set());
        } else {
            setSelected(
                new Set(remainingSets.map(set => set.id))
            );
        }
    }

    async function handleImport() {
        if (isImporting || selected.size === 0) return;

        setIsImporting(true);
        setError("");

        try {
            const result = await editSet.migrateLocalSets(
                [...selected],
                user
            );

            if (result.failed.length === 0) {
                onClose();
                return;
            }

            // Remove successful imports from the popup.
            setRemainingSets(previous =>
                previous.filter(
                    set => !result.imported.includes(set.id)
                )
            );

            // Keep failed sets selected so they can be retried.
            setSelected(new Set(result.failed));

            setError(
                `${result.failed.length} ${
                    result.failed.length === 1 ? "set" : "sets"
                } could not be imported. Please try again.`
            );

        } catch (error) {
            console.error("Import failed:", error);

            setError(
                "Unable to import your sets. Please try again."
            );
        } finally {
            setIsImporting(false);
        }
    }

    return (
        <div
            className="importModalOverlay"
            onClick={event => {
                if (
                    event.target === event.currentTarget &&
                    !isImporting
                ) {
                    onClose();
                }
            }}
        >
            <div
                className="importModal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="importModalTitle"
            >
                <button
                    className="importClose"
                    onClick={onClose}
                    disabled={isImporting}
                    aria-label="Close import dialog"
                    type="button"
                >
                    &times;
                </button>

                <h1 id="importModalTitle">
                    Bring your sets with you!
                </h1>

                <p className="importDescription">
                    We found {remainingSets.length} flashcard {
                        remainingSets.length === 1 ? "set" : "sets"
                    } saved on this device. Would you like to
                    transfer them to your account?
                </p>

                <div className="importSelectAll">
                    <label>
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleAll}
                            disabled={isImporting}
                        />
                        Select all
                    </label>

                    <span>
                        {selected.size} selected
                    </span>
                </div>

                <div className="importSetList">
                    {remainingSets.map(set => (
                        <label
                            key={set.id}
                            className={`importSetItem ${
                                selected.has(set.id)
                                    ? "importSetSelected"
                                    : ""
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={selected.has(set.id)}
                                onChange={() => toggleSet(set.id)}
                                disabled={isImporting}
                            />

                            <div className="importSetDetails">
                                <strong>{set.name}</strong>

                                <span>
                                    {set.length} {
                                        set.length === 1
                                            ? "card"
                                            : "cards"
                                    }
                                </span>
                            </div>
                        </label>
                    ))}
                </div>

                <p className="importNote">
                    Imported sets will be moved to your account.
                    Unselected sets will remain on this device.
                </p>

                {error && (
                    <p className="importError" role="alert">
                        {error}
                    </p>
                )}

                <div className="importActions">
                    <button
                        type="button"
                        className="importCancel"
                        onClick={onClose}
                        disabled={isImporting}
                    >
                        Not now
                    </button>

                    <button
                        type="button"
                        className="importConfirm"
                        onClick={handleImport}
                        disabled={
                            isImporting || selected.size === 0
                        }
                    >
                        {isImporting
                            ? "Importing..."
                            : `Import ${selected.size} ${
                                selected.size === 1
                                    ? "set"
                                    : "sets"
                            }`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportSetsModal;
