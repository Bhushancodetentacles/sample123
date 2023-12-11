import { useEffect, useState } from "react";
import Header from '../Componant/Common/Header'
import PopupModals from '../Componant/PopupModals'
import AccountPreview from '../Componant/Popups/AccountPreview'
import { get } from '../services/apiService'
import { useNavigate } from "react-router-dom";

function Dashboard() {
    
    const [openDialog, setDialogOpen] = useState(false)
    //tabs
    const tabs = ["Hot", "All"]
    const [active, setActive] = useState('Hot')

    function handleDialogClose() {
        setDialogOpen(false)
    }

    useEffect(() => {
        // Create a script element
        const script = document.createElement('script');
        script.src = 'https://cryptorank.io/widget/marquee.js';
        // Append the script to the document
        document.body.appendChild(script);
        // Clean up the script element when the component unmounts
        return () => {
          document.body.removeChild(script);
        };
      }, []);
    return (
        <>
            <Header />

            <div className=" py-4 rounded-lg margintop" id="Hot" role="tabpanel" aria-labelledby="Hot-tab">
                <div className="newsbox" >
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 p-5">
                        <div className="col-span-1">
                            <p className="text-center font-bold" >News Headline </p>
                            <p className="text-center font-bold">Some text to tempt  the reader here wow</p>
                            <p className="text-center"><a className=" font-bold text-xs text-white" href="/">Read More..</a></p>
                        </div>
                        <div className="col-span-1">
                            <p className="text-center font-bold" >News Headline </p>
                            <p className="text-center font-bold">Some text to tempt  the reader here wow</p>
                            <p className="text-center"><a className=" font-bold text-xs text-white" href="/">Read More..</a></p>
                        </div>
                        <div className="col-span-1">
                            <p className="text-center font-bold" >News Headline </p>
                            <p className="text-center font-bold">Some text to tempt  the reader here wow</p>
                            <p className="text-center"><a className=" font-bold text-xs text-white" href="/">Read More..</a></p>
                        </div>
                    </div>
                </div>

            </div>
            <div className="bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full py-3" >
                <>
                    {
                        openDialog && <PopupModals open={true} onDialogClose={handleDialogClose}>
                            <AccountPreview onClose={handleDialogClose} />
                        </PopupModals>
                    }

                    <div className="">

                        <div className="mb-4 ">
                            <ul className=" px-4 flex flex-wrap -mb-px text-sm font-medium text-center justify-start">
                                {
                                    tabs.map(item => <>
                                        <li className="mr-2" >
                                            <button onClick={() => setActive(item)} className={`inline-block hovereffect text-lg p-2 ${active === item && 'tabborder'}  rounded-t-lg`} type="button">{item}</button>
                                        </li>
                                    </>
                                    )
                                }
                            </ul>
                        </div>
                        <div className=" py-4 mt-5 rounded-lg " id="Hot" role="tabpanel" aria-labelledby="Hot-tab">
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 p-5">
                                <div id="cr-widget-marquee"
                                    data-coins="quant,ripple,stellar,xdc-network,constellation,hedera-hashgraph,allianceblock-nexera,casper,algorand"
                                    data-theme="dark"
                                    data-show-symbol="true"
                                    data-show-icon="true"
                                    data-show-period-change="true"
                                    data-period-change="24H"
                                    data-api-url="https://api.cryptorank.io/v0"
                                >
                                </div>
                            </div>
                        </div>
                        <div id="myTabContent">
                            {
                                active === 'Hot' ? <HotCollection /> : <AllCollection />

                            }
                        </div>

                    </div>
                </>
            </div>
        </>
    )
}



function AllCollection() {
    const navigate = useNavigate()

    const [allCollectionsData, setAllCollectionData] = useState([])
    //get all collection
    async function getAllCollection() {
        try {
            const result = await get('allCollections')
            setAllCollectionData(result.data.collectionData)
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getAllCollection()
    }, [])

    return (<>

        <div className=" p-4 rounded-lg " id="All" role="tabpanel" aria-labelledby="All-tab">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                <div className="col-span-1">
                    <div className="p-10 bg-primaryDarkCards rounded-md  overflow-x-auto" style={{ border: "2px solid rgba(34, 47, 27, 0.19)" }}>
                        <table className="min-w-full divide-y divide-gray-200 supporttable fixeded w-full" >
                            <thead className="">
                                <tr >
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                    <div class="flex justify-center">Collection</div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                        <div class="flex justify-center">Minted</div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                        <div class="flex justify-center">Floor Price</div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                        <div class="flex justify-center">volume</div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                        <div class="flex justify-center">Last 7 Days</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    allCollectionsData.map(item => <>
                                        <tr className=" " onClick={() => navigate(`/viewCollection/${item.collectionId}`)}>
                                            <td scope="row" className="px-2 py-2">
                                                <div className="hoverme">
                                                    <img src={item.collectionImage} alt="" style={{ width: '30px', height: "30px", margin: "auto" }} />
                                                    <div className="pop">
                                                        <img src={item.collectionImage} alt="" className="nftimage" style={{ width: "100%" }} />
                                                        <h2 className="text-left text-lg mt-5 mb-5 font-bold mb-5">{item.name}</h2>
                                                        <div className="flex justify-between" >
                                                            <div>
                                                                <p>MINTED</p>
                                                            </div>
                                                            <div>
                                                                <p>{item.minted || '--'}/{item.unminted || '--'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between" >
                                                            <div>
                                                                <p>FLOOR PRICE</p>
                                                            </div>
                                                            <div>
                                                                <p>{item.floorPrice}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between" >
                                                            <div>
                                                                <p>VOLUME</p>
                                                            </div>
                                                            <div>
                                                                <p>{item.volume}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between" >
                                                            <div>
                                                                <p>LAST 7 DAYS</p>
                                                            </div>
                                                            <div>
                                                                <p>{item.lastSevenDays}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </td>
                                            <td className="px-2 py-2  tabledata">
                                                {item.minted || '--'}/{item.unminted || '--'}
                                            </td>
                                            <td className="px-2 py-2  tabledata">
                                                {item.floorPrice}
                                            </td>
                                            <td className="px-2 py-2 ">
                                                {item.volume}
                                            </td>
                                            <td className="px-2 py-2 ">
                                                {item.lastSevenDays}
                                            </td>
                                        </tr>
                                    </>)
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

function HotCollection() {
    const navigate = useNavigate()
    const [hotCollectionsData, setHotCollectionData] = useState([])
    const [hotCollectionsData1, setHotCollectionData1] = useState([])
    //get getHotCollection 
    async function getHotCollection() {
        try {
            const result = await get('hotCollections')
            const collectionData = result.data.collectionData;

            // Calculate the midpoint of the array
            const midpoint = Math.ceil(collectionData.length / 2);

            // Split the data into two halves
            const firstHalf = collectionData.slice(0, midpoint);
            const secondHalf = collectionData.slice(midpoint);

            setHotCollectionData(firstHalf);
            setHotCollectionData1(secondHalf);
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getHotCollection()
    }, [])

    return (<>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="col-span-1">
                <div className="p-10 bg-primaryDarkCards rounded-md  overflow-x-auto" style={{ border: "2px solid rgba(34, 47, 27, 0.19)" }}>

                    <table className="w-full divide-y divide-gray-200 supporttable dashboardtable "  >
                        <thead className="">

                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                    <div class="flex justify-center">Collection</div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                    <div class="flex justify-center">Minted</div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                    <div class="flex justify-center">Floor Price</div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                    <div class="flex justify-center">volume</div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                    <div class="flex justify-center">Last 7 Days</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                hotCollectionsData.map(item => <>
                                    <tr className=" " onClick={() => navigate(`/viewCollection/${item.collectionId}`)}>
                                        <td scope="row" className="px-2 py-2">

                                            <div className="hoverme">
                                                <img src={item.collectionImage} alt="" style={{ width: '30px', height: "30px", margin: "auto" }} />
                                                <div className="pop">
                                                    <img src={item.collectionImage} alt="" className="nftimage" style={{ width: "100%" }} />
                                                    <h2 className="text-left text-lg mt-5 mb-5 font-bold mb-5">{item.name}</h2>

                                                    <div className="flex justify-between" >
                                                        <div>
                                                            <p className="listhead" >MINTED</p>
                                                        </div>
                                                        <div>
                                                            <p className="truncate listcontent">{item.minted || '--'}/{item.unminted || '--'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between" >
                                                        <div>
                                                            <p className="listhead">FLOOR PRICE</p>
                                                        </div>
                                                        <div>
                                                            <p className="truncate listcontent">{item.floorPrice}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between" >
                                                        <div>
                                                            <p className="listhead">VOLUME</p>
                                                        </div>
                                                        <div>
                                                            <p className="truncate listcontent"> {item.volume}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between" >
                                                        <div>
                                                            <p className="listhead">LAST 7 DAYS</p>
                                                        </div>
                                                        <div>
                                                            <p className="truncate listcontent">{item.lastSevenDays}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-2  tabledata">
                                            {item.minted || '--'}/{item.unminted || '--'}
                                        </td>
                                        <td className="px-2 py-2  tabledata">
                                            {item.floorPrice}
                                        </td>
                                        <td className="px-2 py-2 ">
                                            {item.volume}
                                        </td>
                                        <td className="px-2 py-2 ">
                                            {item.lastSevenDays}
                                        </td>
                                    </tr>
                                </>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="col-span-1">
                <div className="p-10 bg-primaryDarkCards rounded-md  overflow-x-auto" style={{ border: "2px solid rgba(34, 47, 27, 0.19)" }}>
                    <table className="w-full divide-y divide-gray-200 supporttable dashboardtable " >
                        <thead className="text-xs  uppercase  dark:text-gray-400">
                        <tr >
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                    <div class="flex justify-center">Collection</div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                        <div class="flex justify-center">Minted</div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                        <div class="flex justify-center">Floor Price</div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                        <div class="flex justify-center">volume</div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ">
                                        <div class="flex justify-center">Last 7 Days</div>
                                    </th>
                                </tr>
                        </thead>
                        <tbody>
                            {
                                hotCollectionsData1.map(item => <>
                                    <tr className=" " onClick={() => navigate(`/viewCollection/${item.collectionId}`)}>
                                        <td scope="row" className="px-2 py-2">
                                            
                                            <div className="hoverme">
                                                <img src={item.collectionImage} alt="" style={{ width: '30px', height: "30px", margin: "auto" }} />
                                                <div className="pop">
                                                    <img src={item.collectionImage} alt="" className="nftimage" style={{ width: "100%" }} />
                                                    <h2 className="text-left text-lg mt-5 mb-5 font-bold mb-5">{item.name}</h2>

                                                    <div className="flex justify-between" >
                                                        <div>
                                                            <p>MINTED</p>
                                                        </div>
                                                        <div>
                                                            <p>{item.minted || '--'}/{item.unminted || '--'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between" >
                                                        <div>
                                                            <p>FLOOR PRICE</p>
                                                        </div>
                                                        <div>
                                                            <p>{item.floorPrice}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between" >
                                                        <div>
                                                            <p>VOLUME</p>
                                                        </div>
                                                        <div>
                                                            <p> {item.volume}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between" >
                                                        <div>
                                                            <p>LAST 7 DAYS</p>
                                                        </div>
                                                        <div>
                                                            <p>{item.lastSevenDays}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-2 py-2  tabledata">
                                            {item.minted || '--'}/{item.unminted || '--'}
                                        </td>
                                        <td className="px-2 py-2  tabledata">
                                            {item.floorPrice}
                                        </td>
                                        <td className="px-2 py-2 ">
                                            {item.volume}
                                        </td>
                                        <td className="px-2 py-2 ">
                                            {item.lastSevenDays}
                                        </td>
                                    </tr>
                                </>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>)
}

export default Dashboard
