import { useState, useEffect } from "react";
import TokenTransfer from "./TokenTransfer";
import PopupModals from "../PopupModals";



function AccountPreview() {
    const [openDialog, setDialogOpen] = useState(false)
    //
    function handleDialogClose() {
        setDialogOpen(false)
    }
    return (
        <>
 {
                openDialog && <PopupModals open={true} onDialogClose={handleDialogClose}>
                    <TokenTransfer onClose={handleDialogClose} />
                </PopupModals>
            }
            <div>
                <h1 className=" mb-5">Account Preview</h1>
                <form className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
                        <div className="col-span-1">
                            <div className="md:flex md:items-center mb-1">
                                <div className="md:w-1/3">
                                    <label className="block  text-xs md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                                         Forename
                                    </label>
                                </div>
                                <div className="w-full">
                                    <input className="bg-gray-200 accountinput appearance-none border-2 border-gray-200 rounded w-full py-2 px-4  leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" placeholder="Janathon"/>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="md:flex md:items-center mb-1">
                                <div className="md:w-1/3">
                                    <label className="block  text-xs md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                                        Surname
                                    </label>
                                </div>
                                <div className="w-full">
                                    <input className="bg-gray-200 accountinput appearance-none border-2 border-gray-200 rounded w-full py-2 px-4  leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" placeholder="Example" />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="md:flex md:items-center justify-between mb-3">
                                <div className="md:w-1/3">
                                    <label className="block  text-xs md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                                        Email
                                    </label>
                                </div>
                                <div className="w-full">
                                    <input className="bg-gray-200 accountinput appearance-none border-2 border-gray-200 rounded w-full py-2 px-4  leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" placeholder="Example@gmail.com" />
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
                        <div className="col-span-1">
                            <div className="md:flex md:items-center justify-between mb-6">
                                <div >
                                    <label className="block text-xs  md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name" style={{width:"75px"}}>
                                        User ID
                                    </label>
                                </div>
                                <div className="w-full">
                                    <input className="bg-gray-200 accountinput appearance-none border-2 border-gray-200 rounded w-full py-2 px-4  leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" placeholder="Janathon" />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="flex  mb-2">
                                <div className="md:w-1/3">
                                    <label className="block text-xs  md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                                        Address(s)
                                    </label>
                                </div>
                                <div className="block w-full " >
                                    <div className="w-full mb-4">
                                        <input className="bg-gray-200 accountinput appearance-none border-2 border-gray-200 rounded w-full py-2 px-4  leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" placeholder="1st street name, town, City, state, ZIP" />
                                    </div>
                                    <div className="w-full mb-4">
                                        <input className="bg-gray-200 accountinput appearance-none border-2 border-gray-200 rounded w-full py-2 px-4  leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" placeholder="none" />
                                    </div>
                                    <div className="w-full mb-2">
                                        <input className="bg-gray-200 accountinput appearance-none border-2 border-gray-200 rounded w-full py-2 px-4  leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" placeholder="none" />
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-3">
                        <div className="col-span-1 text-left">
                            <div className="md:w-1/3">
                                <label className="block  text-xs md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                                    Associated Wallet(s)
                                </label>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="md:flex md:items-center ">

                                <div className="w-full text-right">
                                    <input className="bg-gray-200 appearance-none accountinput border-2 border-gray-200 rounded w-full py-2 px-4  leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" placeholder="349dhgyt5yue5yi45" />
                                    <span className="formspan" >XinFin</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="md:flex md:items-center ">

                                <div className="w-full text-right">
                                    <input className="bg-gray-200 appearance-none accountinput border-2 border-gray-200 rounded w-full py-2 px-4  leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" placeholder="none" />
                                    <span className="formspan">Chain</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="md:flex md:items-center ">

                                <div className="w-full text-right">
                                    <input className="bg-gray-200 appearance-none accountinput border-2 border-gray-200 rounded w-full py-2 px-4  leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="inline-full-name" type="text" placeholder="none" />
                                    <span className="formspan">Chain</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 text-left">
                            <div className="md:w-1/3">
                                <label className="block text-xs  md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                                    Account Status
                                </label>
                            </div>
                        </div>
                        <div className="col-span-1">
                        <div className="mb-5">
                            <select id="countries" className="logininput py-0 px-2">
                                <option selected>Select a country</option>
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="FR">France</option>
                                <option value="DE">Germany</option>
                            </select>
                        </div>
                        </div>

                    </div>
                </form>
                <div className="flex justify-end gap-5" >
                <button className='actionbuttons' style={{ margin: '0' }} >Reset Password</button>
                <button className='actionbuttons' style={{ margin: '0' }} >Save Changes</button>
                </div>
                <div>
                <div className='flex justify-between mt-5' >
                  <h1 className=' item-center my-auto' >NFTs</h1>

                  <form>

                    <div className="relative">

                      <input type="search" id="default-search" className="block w-full p-4  text-sm searchbox" placeholder="Search" required />
                      <button type="submit" className=" absolute  absolute right-2.5 bottom-4  top-3   "><svg className="w-4 h-4 text-gray-500 dark:text-gray-400 usercolor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                      </svg></button>
                    </div>
                  </form>
                </div>
                <div>

                  <div className="relative overflow-x-auto mt-5">
                    <table className="w-full text-sm accountpreviewtable text-left  dark:">
                      <thead className="text-xs  uppercase  dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-2 py-2 ">
                            Token ID
                          </th>
                          <th scope="col" className="px-2 py-2 ">
                            Token Name
                          </th>
                          <th scope="col" className="px-2 py-2 ">
                            Collection
                          </th>
                          <th scope="col" className="px-2 py-2 ">
                            
                          </th>
                          <th scope="col" className="px-2 py-2 ">
                            
                          </th>
                          
                        </tr>
                      </thead>
                      <tbody>
                      <tr className=" ">
                          <td scope="row" className="px-2 py-2 font-medium -900 whitespace-nowrap dark:">
                            ABCD85369579634
                          </td>
                          <td className="px-2 py-2  text-lg">
                            Ashwini
                          </td>
                          <td className="px-2 py-2  text-lg">
                            Khedekar
                          </td>
                          <td className="px-2 py-2  text-lg">
                          <button className='makeofferbutton' style={{ margin: 'auto' }} >View </button>
                          </td>
                          <td className="px-2 py-2  text-lg">
                          <button className='makeofferbutton' style={{ margin: 'auto' }} onClick={() => setDialogOpen(true)}>Transfer</button>
                          </td>
                          
                        </tr>
                        <tr className=" ">
                          <td scope="row" className="px-2 py-2 font-medium -900 whitespace-nowrap dark:">
                            ABCD85369579634
                          </td>
                          <td className="px-2 py-2  text-lg">
                            Ashwini
                          </td>
                          <td className="px-2 py-2  text-lg">
                            Khedekar
                          </td>
                          <td className="px-2 py-2  text-lg">
                          <button className='makeofferbutton' style={{ margin: 'auto' }} >View </button>
                          </td>
                          <td className="px-2 py-2  text-lg">
                          <button className='makeofferbutton' style={{ margin: 'auto' }} onClick={() => setDialogOpen(true)}>Transfer</button>
                          </td>
                          
                        </tr>
                        <tr className=" ">
                          <td scope="row" className="px-2 py-2 font-medium -900 whitespace-nowrap dark:">
                            ABCD85369579634
                          </td>
                          <td className="px-2 py-2  text-lg">
                            Ashwini
                          </td>
                          <td className="px-2 py-2  text-lg">
                            Khedekar
                          </td>
                          <td className="px-2 py-2  text-lg">
                          <button className='makeofferbutton' style={{ margin: 'auto' }} >View </button>
                          </td>
                          <td className="px-2 py-2  text-lg">
                          <button className='makeofferbutton' style={{ margin: 'auto' }} onClick={() => setDialogOpen(true)}>Transfer</button>
                          </td>
                          
                        </tr>
                        

                      </tbody>
                    </table>
                  </div>
                  <div className="text-center" >
                  <button type="submit" className="p-0 m-5  createsubmitbutton1  "> Cancel </button>
                  </div>
                </div>
                </div>
            </div>
        </>
    )
}

export default AccountPreview;
