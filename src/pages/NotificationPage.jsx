
import { useState } from "react"
import PopupModals from "../Componant/PopupModals"
import Mintproccess from "../Componant/Popups/Mintproccess"
import Header from "../Componant/Common/Header"

function NotificationPage() {
    const [openDialog, setDialogOpen] = useState(false)
    //
    function handleDialogClose() {
        setDialogOpen(false)
    }

    return (
        <>
            {
                openDialog && <PopupModals open={true} onDialogClose={handleDialogClose}>
                    <Mintproccess onClose={handleDialogClose} />
                </PopupModals>
            }
            <Header />
            <div className="bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full py-3 px-5 margintop" >
                

                <h1 className="text-left mb-5 mt-5">My Messages</h1>

                <div className=" bg-white p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 notificationgrid">
                        <div className="col-span-1">
                            <div className="flex items-center mb-4">
                                <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <div>
                                    <p className="notificationpara" >Offer on BASETOKEN !</p>
                                    <p className="notificationpara1" >Username1234! has Offered 1.7 QNT for 'BASETOKEN'! (Chupracabra #1234!)</p>

                                    <p className="timespan px-2">Recived 14:34 14/May/2023</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 grid items-center">
                            <div className="flex  justify-between gap-5" >
                                <button className="notifybutton w-full truncate truncate" style={{ width: "90%" }}>View Token</button>
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }}>Accept</button>
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }}>Reject</button>
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }} onClick={() => setDialogOpen(true)}>Pay Now</button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-5 notificationgrid">
                        <div className="col-span-1">
                            <div className="flex items-center mb-4">
                                <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <div>
                                    <p className="notificationpara" >Offer on BASETOKEN !</p>
                                    <p className="notificationpara1" >Username1234! has Offered 1.7 QNT for 'BASETOKEN'! (Chupracabra #1234!)</p>

                                    <p className="timespan px-2">Recived 14:34 14/May/2023</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 grid items-center">
                            <div className="flex  justify-between gap-5" >
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }}>View Token</button>
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }}>Accept</button>
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }}>Reject</button>
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }} onClick={() => setDialogOpen(true)}>Pay Now</button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-5 notificationgrid">
                        <div className="col-span-1">
                            <div className="flex items-center mb-4">
                                <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <div>
                                    <p className="notificationpara" >Offer on BASETOKEN !</p>
                                    <p className="notificationpara1" >Username1234! has Offered 1.7 QNT for 'BASETOKEN'! (Chupracabra #1234!)</p>

                                    <p className="timespan px-2">Recived 14:34 14/May/2023</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 grid items-center">
                            <div className="flex  justify-between gap-5" >
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }}>View Token</button>
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }}>Accept</button>
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }}>Reject</button>
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }} onClick={() => setDialogOpen(true)}>Pay Now</button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-5 notificationgrid">
                        <div className="col-span-1">
                            <div className="flex items-center mb-4">
                                <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <div>
                                    <p className="notificationpara" >Offer on BASETOKEN !</p>
                                    <p className="notificationpara1" >Username1234! has Offered 1.7 QNT for 'BASETOKEN'! (Chupracabra #1234!)</p>

                                    <p className="timespan px-2">Recived 14:34 14/May/2023</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 grid items-center">
                            <div className="flex  justify-between gap-5" >
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }}>View Token</button>
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }}>Accept</button>
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }}>Reject</button>
                                <button className="notifybutton w-full truncate" style={{ width: "90%" }} onClick={() => setDialogOpen(true)}>Pay Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotificationPage
