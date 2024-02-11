import { Navigate, Route, Routes } from "react-router-dom";

import BeerServerPage from './components/pages/beerServerPage';
import CognitoAuthRedirectPage from './components/pages/cognitoAuthRedirectPage';
import FitbitAuthRedirectPage from './components/pages/fitbitAuthRedirectPage';
import GoalManagePage from './components/pages/goalManagePage';
import UserAuthPage from './components/pages/userAuthPage';
import ChatPage from "./components/pages/chatPage";
import { AuthLoginRedirect } from './contexts/authLoginRedirect';
import GoalManageGuestPage from "./components/pages/goalManageGuestPage";
import UserAuthGuestPage from "./components/pages/userAuthGuestPage";

export const CustomRoutes = () => {
    return (
        <Routes>
            <Route path="/beer" element={<BeerServerPage />} />
            <Route path="/auth" element={<UserAuthPage />} />
            <Route path="/auth/guest" element={<UserAuthGuestPage />} />
            <Route path="/chat" element={<ChatPage/>} />
            <Route path="/goal" element={
                <AuthLoginRedirect>
                    <GoalManagePage />
                </AuthLoginRedirect>
            }/>
            <Route path="/goal/guest" element={<GoalManageGuestPage/>}/>
            <Route path="/redirect/login/fitbit" element={<FitbitAuthRedirectPage />} />
            <Route path="/redirect/login/cognito" element={<CognitoAuthRedirectPage />} />            
            <Route path="/" element={<Navigate replace to="/goal"/>} />
        </Routes>
    );
}
