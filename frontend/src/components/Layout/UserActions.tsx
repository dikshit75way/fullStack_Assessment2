
import { Link } from "react-router-dom";

interface User {
    name: string;
    role: string;
}

interface UserActionsProps {
    isAuthenticated: boolean;
    user: User | null;
    onLogout: () => void;
}

export const UserActions = ({ isAuthenticated, user, onLogout }: UserActionsProps) => {
    if (isAuthenticated) {
        return (
            <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
                <span className="text-gray-700 font-medium">Hello, {user?.name}</span>
                {user?.role === "admin" && (
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">Admin</Link>
                )}
                <button
                    onClick={onLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition shadow"
                >
                    Logout
                </button>
            </>
        );
    }

    return (
        <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Login</Link>
            <Link to="/register" className="btn-primary px-4 py-2 rounded-md">Register</Link>
        </>
    );
};
