
import { Plus } from 'lucide-react'
import { useState, useEffect } from "react";
import PopupModals from '../PopupModals'
import Payment from './Payment'


function Mintproccess() {
    const [openDialog, setDialogOpen] = useState(false)
    //
    function handleDialogClose() {
        setDialogOpen(false)
    }
    return (
        <>
            {
                openDialog && <PopupModals open={true} onDialogClose={handleDialogClose}>
                    <Payment onClose={handleDialogClose} />
                </PopupModals>
            }
            <div>
                <div>
                    <img src="assets/imgs/dummyimage.png" alt="" className='viewimg' style={{ margin: "auto" }} />
                </div>
                <h1 className=' mt-5' >MINT NEW CHIPUCOPRA</h1>
                <h2 className=' mt-4'>SWAG LEVEL - BASIC</h2>
                <div >
                    <h3 className='' >Shipping Address for SWAG</h3>
                    <div className='flex justify-between gap-5 mt-5'>
                        <p className='grid items-center  flextextwidth' >Use my saved Address</p>
                        <div className='grid items-center' >
                            <input id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className='secondflexwidth' >
                            <input type="email" id="email" className="logininput" autoComplete="off" placeholder="My Street address, ZIPCODE" required />

                        </div>
                    </div>
                    <div className='flex justify-between gap-5 mt-5'>
                        <p className='grid items-top  flextextwidth' style={{ width: "44%" }} >Provide new Address</p>
                        <div className='grid items-top' >
                            <input id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div style={{ width: "44%" }}>
                            <div className='secondflexwidth mb-3' >
                                <input type="email" id="email" className="logininput" autoComplete="off" placeholder="Enter Building Name And number" required />

                            </div>
                            <div className='secondflexwidth mb-3' >
                                <input type="email" id="email" className="logininput" autoComplete="off" placeholder="Enter Street Name" required />

                            </div>
                            <div className='secondflexwidth mb-3' >
                                <input type="email" id="email" className="logininput" autoComplete="off" placeholder="Enter Town name" required />

                            </div>
                            <div className='secondflexwidth mb-3' >
                                <input type="email" id="email" className="logininput" autoComplete="off" placeholder="Enter Zip / Postal Code" required />

                            </div>
                            <div className='secondflexwidth mb-3' >
                                <div className="">
                                   
                                    <select id="countries" className="logininput">
                                        <option selected>Select a country</option>
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="FR">France</option>
                                        <option value="DE">Germany</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div >
                    <h3 className='' >Recipient Address for NFT</h3>
                    <div className='flex justify-between gap-5 mt-5'>
                        <p className='grid items-center  flextextwidth' >Use my saved Address</p>
                        <div className='grid items-center' >
                            <input id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className='secondflexwidth' >
                            <input type="email" id="email" className="logininput" autoComplete="off" placeholder="0x475hgfsfegd7658" required />

                        </div>
                    </div>
                    <div className='flex justify-between gap-5 mt-5'>
                        <p className='grid items-center  flextextwidth' >Provide new Address</p>
                        <div className='grid items-center' >
                            <input id="default-radio-1" type="radio" value="" name="default-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div className='secondflexwidth'>
                            <input type="email" id="email" className="logininput" autoComplete="off" placeholder="Enter new 0x address" required />

                        </div>
                    </div>
                    <div className='flex justify-between gap-5 mt-5'>
                        <h3 className='grid items-center  flextextwidth' >0.5      QNT</h3>
                        <div className='secondflexwidth'>
                            <button className='viewbutton px-2 py-2' onClick={() => setDialogOpen(true)}>Pay with Card</button>
                        </div>

                    </div>
                    <div className='flex justify-between gap-5 mt-5'>
                        <h3 className='grid items-center  flextextwidth' >0.5      QNT</h3>
                        <div className='secondflexwidth '>
                            <button className='viewbutton px-2 py-2'>Pay with Crypto</button>
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default Mintproccess;
