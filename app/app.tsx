import {
    Outlet
} from "react-router-dom";
import { UserProvider, useUser } from "./features/shared";
import "./app.css";
import { useNavigation } from "./features/platform";


function AppContent() {
    const { isLoading } = useUser();
    useNavigation();

    if (isLoading) {
        return null;
    }

    return <Outlet />;
}

export default function App() {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
}