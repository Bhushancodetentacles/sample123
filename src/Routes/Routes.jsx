import React from 'react'
import { Outlet, Route, Routes } from "react-router-dom";
import Footer from '../Componant/Common/Footer';
import Login from '../Componant/Common/Login';
import Signup from '../Componant/Common/Signup';
import EmailVarify from '../Componant/Common/EmailVarify';
import AccountSetup from '../Componant/Common/AccountSetup';
import SetUpMFA from '../Componant/Common/SetUpMFA';
import LoginRedirect from "../protectedRoutes/LoginRedirect";
import Bids from "../pages/Bids";
import Offers from "../pages/Offers";
import Dashboard from "../pages/Dashboard";
import MyPortfolio from "../pages/MyPortfolio";
import Profile from '../pages/Profile';
import NotificationPage from '../pages/NotificationPage';
import ViewCollection from '../pages/ViewCollection';
function AllRoutes() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Outlet />}>
                    {/* protected Routes */}
                    <Route path="/dashboard" element={<LoginRedirect />}>
                        <Route index element={<Dashboard />} />
                    </Route>
                    <Route path="/offers" element={<LoginRedirect />}>
                        <Route index element={<Offers />} />
                    </Route>
                    <Route path="/bids" element={<LoginRedirect />}>
                        <Route index element={<Bids />} />
                    </Route>
                    <Route path="/myPortfolio" element={<LoginRedirect />}>
                        <Route index element={<MyPortfolio />} />
                    </Route>
                    <Route path="/profile" element={<LoginRedirect />}>
                        <Route index element={<Profile />} />
                    </Route>
                    <Route path="/notifications" element={<LoginRedirect />}>
                        <Route index element={<NotificationPage />} />
                    </Route>
                    <Route path="/viewCollection/:id" element={<LoginRedirect />}>
                        <Route index element={<ViewCollection />} />
                    </Route>
                    {/* protected Routes End*/}

                    <Route index path="/" element={<Login />} />
                    <Route index path="Footer" element={<Footer />} />
                    <Route index path="Signup" element={<Signup />} />
                    <Route index path="EmailVarify" element={<EmailVarify />} />
                    <Route index path="AccountSetup" element={<AccountSetup />} />
                    <Route index path="/2faAuth" element={<SetUpMFA />} />
                </Route>
            </Routes>

        </div>
    )
}

export default AllRoutes
