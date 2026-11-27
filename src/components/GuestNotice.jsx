import { useAuth } from "../AuthContext";
import { Info } from "lucide-react";

export default function GuestNotice() {
    const { user, isLoading, login } = useAuth();

    if (user || isLoading) return null;

    return (
        <div className="guestNotice">
            <Info size={16} />

            <span>
                Your sets are saved on this device only.
                Clearing your browser data may erase them.{" "}
                <button
                    type="button"
                    onClick={() => login().catch(console.error)}
                >
                    Sign in to keep your sets safe.
                </button>
            </span>
        </div>
    );
}
