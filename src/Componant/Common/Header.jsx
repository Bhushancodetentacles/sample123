import {
  AlignJustify,
  BellDot,
  Briefcase,
  Gavel,
  ScrollText,

  UserCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { socket } from "../../services/socket.io";
import { get } from "../../services/apiService";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const [notificationCount, setNotificationCount] = useState(0);

  const toggleDiv = () => {
    setIsOpen(!isOpen);
  };

  const location = useLocation();

  const requestPermissionForNotification = async () => {
    try {
      const result = await Notification.requestPermission()
      // sendNotification()
      return result
    } catch (error) {
      console.log(error);
    }

  }

  const getNotificationCount = async()=>{
    try {
      const result = await get('getNotificationCount')
      setNotificationCount(result.data.notificationCount)
    } catch (error) {
      console.log(error);
    }
  }

  const sendNotification = (data) => {
    if (Notification.permission === 'granted') {
      // Create and show the notification
      const notification = new Notification(data, {
        body: 'You have a new message from ${}: ',
        icon: '/assets/imgs/logo.png' // Replace with the path to your notification icon
      });
      notification.onclick = (event) => {
        console.log('Notification clicked', event);
      };
    }
  }

  useEffect(() => {
    requestPermissionForNotification()
    socket.on('notification', (data) => {
      console.log('Received notification:', data);
      sendNotification(data)
      getNotificationCount()
      // Handle displaying the notification
    });
    getNotificationCount()
  }, [])

  const buttonStyles = {
    backgroundColor: '#ffcc00',
    color: '#000',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  };


  return (
    <>
      <div className="fixedheader" >
        <div className="bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full py-5 px-5">
          <nav className=" border-gray-200 dark:bg-gray-900">
            <div className="flex justify-between ">
              <div className="max-w-screen-xl flex  items-center justify-between  ">
                <Link to="/dashboard" className="flex items-center">
                  <img
                    src={"/assets/imgs/logo.png"}
                    alt=""
                    width={"200px"}
                    style={{ border: "0" }}
                  />
                </Link>
              </div>
              <div className=" w-full md:block md:w-auto grid items-center desktopview">
                <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0  dark:border-gray-700">
                  <li>
                    <Tooltip title="Connect Wallet" arrow>
                      <ConnectButton style={buttonStyles} chainStatus="icon" showBalance={false} accountStatus={"address"} />
                    </Tooltip>

                  </li>
                  <li className="relative">
                    <Tooltip title="Notification" arrow>
                      <Link to="/notifications" >
                        {" "}
                        <BellDot className={location.pathname === '/notifications' ? 'active-link' : 'usercolor'} style={{ width: "35px", height: "35px" }} />
                      </Link>
                      <span className="notificationcount">{notificationCount}</span>
                    </Tooltip>

                  </li>
                  <li>
                    <Tooltip title="Bids" arrow>
                      <Link to="/bids">
                        {" "}
                        <Gavel className={location.pathname === '/bids' ? 'active-link' : 'usercolor'} style={{ width: "35px", height: "35px" }} />
                      </Link>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title="Offers" arrow>
                      <Link to="/offers">
                        {" "}
                        <ScrollText className={location.pathname === '/offers' ? 'active-link' : 'usercolor'} style={{ width: "35px", height: "35px" }} />
                      </Link>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title="My Portfolio" arrow>
                      <Link to="/myPortfolio">
                        {" "}
                        <Briefcase className={location.pathname === '/myPortfolio' ? 'active-link' : 'usercolor'} style={{ width: "35px", height: "35px" }} />
                      </Link>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title="My Account" arrow>
                      <Link to="/profile">
                        {" "}
                        <UserCircle className={location.pathname === '/profile' ? 'active-link' : 'usercolor'} style={{ width: "35px", height: "35px" }} />
                      </Link>
                    </Tooltip>

                  </li>

                </ul>
              </div>
              <div className=" md:order-2 mobileview  grid items-center">
                {/* <button
                data-collapse-toggle="navbar-dropdown"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-dropdown"
                aria-expanded="false"
                // onClick={()=>setIsMobileView(!isMobileView)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button> */}
                <AlignJustify onClick={toggleDiv} />
              </div>
            </div>
            {/* <div className={`${isMobileView ? 'hidden' :''} w-full`}> */}
            {isOpen &&
              <div className={`viewvise w-full`}>
                <ul className="flex w-full flex-wrap gap-5 justify-between mb-5 font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0  dark:border-gray-700">
                  <li>
                    <Tooltip title="Connect Wallet" arrow>
                      <ConnectButton style={buttonStyles} chainStatus="icon" showBalance={false} accountStatus={"address"} />
                    </Tooltip>

                  </li>
                  <li className="relative">
                    <Tooltip title="Notification" arrow>
                      <Link to="/notifications" >
                        {" "}
                        <BellDot className={location.pathname === '/notifications' ? 'active-link' : 'usercolor'} style={{ width: "35px", height: "35px" }} />
                      </Link>
                      <span className="notificationcount">{notificationCount}</span>
                    </Tooltip>

                  </li>
                  <li>
                    <Tooltip title="Bids" arrow>
                      <Link to="/bids">
                        {" "}
                        <Gavel className={location.pathname === '/bids' ? 'active-link' : 'usercolor'} style={{ width: "35px", height: "35px" }} />
                      </Link>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title="Offers" arrow>
                      <Link to="/offers">
                        {" "}
                        <ScrollText className={location.pathname === '/offers' ? 'active-link' : 'usercolor'} style={{ width: "35px", height: "35px" }} />
                      </Link>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title="My Portfolio" arrow>
                      <Link to="/myPortfolio">
                        {" "}
                        <Briefcase className={location.pathname === '/myPortfolio' ? 'active-link' : 'usercolor'} style={{ width: "35px", height: "35px" }} />
                      </Link>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title="My Account" arrow>
                      <Link to="/profile">
                        {" "}
                        <UserCircle className={location.pathname === '/profile' ? 'active-link' : 'usercolor'} style={{ width: "35px", height: "35px" }} />
                      </Link>
                    </Tooltip>

                  </li>
                </ul>
              </div>
            }
          </nav>
        </div>
      </div>

    </>
  );
}

export default Header;
