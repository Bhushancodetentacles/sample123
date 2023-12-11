import {  MoveLeft, MoveRight } from 'lucide-react'
import React from 'react';
import { Link } from 'react-router-dom';

function AccountSetup() {
    return (
        <div>
            <img src="assets/imgs/Logo.png" className='Logo' alt="" style={{ border: "0" }} />

            <div className="w-full max-w-sm  m-auto maincard   shadow  p-4"  >
                <div className="">
                    <h1 className='mb-5'>Login</h1>

                    <form>

                        <div className="mb-5">
                            <label for="countries" className="block  text-sm font-light text-left inputlabel">Source of Funds</label>
                            <select id="countries" className="logininput">
                                <option selected>Choose a country</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="FR">France</option>
                                <option value="DE">Germany</option>
                            </select>
                        </div>
                        <div className="mb-5">
                            <label for="countries" className="block  text-sm font-light text-left inputlabel">Wallet Chain</label>
                            <select id="countries" className="logininput">
                                <option selected>Choose a country</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="FR">France</option>
                                <option value="DE">Germany</option>
                            </select>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="email" className="block  text-sm font-light text-left inputlabel" >Wallet address</label>
                            <input type="email" id="email" className="logininput " autoComplete="off" placeholder="Enter Funding address" required />
                        </div>
                        <h2 className='text-left mb-5' >Home / Trading Address</h2>
                        <div className="mb-5 relative">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-left inputlabel" >Name and Number</label>
                            <input type="password" id="password" className="logininput" autoComplete="off" placeholder='Enter building name and number' required />

                        </div>
                        <div className="mb-5 relative">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-left inputlabel" >Street</label>
                            <input type="password" id="password" className="logininput" autoComplete="off" placeholder='Enter Street name' required />

                        </div>
                        <div className="mb-5 relative">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-left inputlabel" >Town</label>
                            <input type="password" id="password" className="logininput" autoComplete="off" placeholder='Enter Town name' required />

                        </div>
                        <div className="mb-5 relative">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-left inputlabel" >Zip / Postal Code</label>
                            <input type="password" id="password" className="logininput" autoComplete="off" placeholder='Enter Zip / Postal code' required />

                        </div>
                        <div className="mb-5">
                            <label for="countries" className="block  text-sm font-light text-left inputlabel">Country</label>
                            <select id="countries" className="logininput">
                                <option selected>Select a country</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="FR">France</option>
                                <option value="DE">Germany</option>
                            </select>
                        </div>

                        <div className='flex justify-center mt-5' >
                            <Link to="/Signup" className='createsubmitbutton ' >
                                <button type="submit" className="p-0 flex gap-2 justify-center m-auto w-full"> <MoveLeft/> BACK </button>
                            </Link>
                            <Link to="/SetUpMFA" className='createsubmitbutton ' >
                                <button type="submit" className=" p-0 flex gap-2 justify-center m-auto w-full">NEXT <MoveRight /></button>
                            </Link>
                        </div>
                        <p className='text-center mt-5'>Important Information about legal, Ts & Cs <br /> Copyrights Etc</p>
                    </form>


                </div>

            </div>

        </div>
    )
}

export default AccountSetup
