import { useState, useEffect } from "react";
import Header from '../Componant/Common/Header'
import PopupModals from "../Componant/PopupModals";
import { get } from "../services/apiService";

import useContractService from "../hooks/useContractService";
import TransactionConfirmation from "../Componant/Popups/TransactionConfirmation";
import { auctionEndDays } from "../utils/auctionEndDays";
import { formatUnixFormatDate } from "../utils/formatUnixFormatDate";
import { formatRelativeTime } from "../utils/lastBidSubmited";
import MakeOffer from "../Componant/Popups/MakeOffer";
import PlacebidModal from "../Componant/Popups/PlacebidModal";
import { CandlestickChart, Clock12, Filter, ListChecks, User } from "lucide-react";
import WrongWalletAddressDialog from "../Componant/Popups/WrongWalletAddressDialog";
import WalletNotConnectedPopup from "../Componant/Popups/WalletNotConnectedPopup";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSearchParams } from "react-router-dom";
const CHAIN_ID = parseInt(import.meta.env.VITE_APP_CHAIN_ID)
const waitingTime = parseInt(import.meta.env.VITE_APP_WAITING_TIME)
const PAGE_SIZE = 6
function Bids() {
    const [active, setActive] = useState("My Bids")
    const [tabs, setTabs] = useState(["My Bids", "NFT's For Sales"])
    const [URLSearchParams, setURLSearchParams] = useSearchParams()

    useEffect(() => {
        const tabFromURL = URLSearchParams.get('tab');
        if (tabFromURL) {
            setActive(tabFromURL);
        } else {
            setURLSearchParams({ tab: active });
        }
    }, [active, URLSearchParams, setURLSearchParams]);
    return (
        <>
            <div>
                <Header />
                <div className="bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full py-3 px-5 margintop">
                    <h2 className=" font-bold text-left mt-5 mb-5">My Bids</h2>
                    <div className="flex justify-between" >
                        <ul className="flex  -mb-px text-sm font-medium text-center justify-end">
                            {
                                tabs.map(item => <>
                                    <li className="mr-2">
                                        <button onClick={() => setURLSearchParams({ tab: item })} className={`inline-block  hovereffect text-lg p-2 ${active === item && 'tabborder '}  rounded-t-lg`} type="button">{item}</button>
                                    </li>
                                </>
                                )
                            }
                        </ul>
                    </div>
                </div>
                {
                    active === "NFT's For Sales" ? <BidsInfo /> : <MyBidsInfo />
                }
            </div>
        </>
    )
}

function BidsInfo() {
    const { purchaseNFTFromFixedSale, tokenApprovalForMarketPlaceContract, handleMetamaskError, isWalletConnected, isWrongWalletConnected } = useContractService()
    const [nftData, setNftData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterType, setFilterType] = useState('fixed')
    const [isTransaction, setIsTransaction] = useState(false)
    const [transactionMessage, setTransactionMessage] = useState("Please Wait...");
    const [offerData, setOfferData] = useState(null)
    const [isOffer, setIsOffer] = useState(false)
    const [isPlaceBid, setIsPlaceBid] = useState(false)
    const [placeBidData, setPlaceBidData] = useState(null)
    const [isAddressWrong, setIsAddressWrong] = useState(false)
    const [hasWalletNotConnected, setHasWalletNotConnected] = useState(false)
    const [nftDataLength, setnftDataLength] = useState(0)
    const [page, setPage] = useState(1);
    //get nft list
    const getNftListFixed = async () => {
        try {
            setIsLoading(true)
            const result = await get(`allFixedSellNftList?page=${page}&perPage=${PAGE_SIZE}`)
            const newData = result.data.nftData;
            setnftDataLength(newData.length)
            setNftData((prevData) => [...prevData, ...newData]);
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }

    const getNftListAuction = async () => {
        setIsLoading(true)
        try {
            const result = await get(`allAuctionSellNftList?page=${page}&perPage=${PAGE_SIZE}`)
            const newData = result.data.nftData;
            setnftDataLength(newData.length)
            setNftData((prevData) => [...prevData, ...newData]);
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }

    //purchase nft from fixed sale 
    const purchaseNFTFromFixedSaleFn = async (_fixedSaleIndex, price) => {
        if (isWrongWalletConnected()) return setIsAddressWrong(true)
        if (!await isWalletConnected(CHAIN_ID)) return setHasWalletNotConnected(true)
        try {
            setIsTransaction(true)
            setTransactionMessage('Waiting For Approval...')
            const approval = await tokenApprovalForMarketPlaceContract(import.meta.env.VITE_APP_NFT_MARKET_PLACE_CONTRACT_ADDRESS, (parseInt(price) / 1e18)?.toString())
            if (approval) {
                await approval.wait()
            }
            setTransactionMessage('Waiting For Transaction...')
            const result = await purchaseNFTFromFixedSale(_fixedSaleIndex)
            setTransactionMessage('Validating Transaction On Blockchain.')
            await result.wait(waitingTime)
            setIsTransaction(false)

        } catch (error) {
            setIsTransaction(false)
            handleMetamaskError(error)
        }
    }
    //
    const handleDialogCloseIsOffer = (apiCall) => {

        if (apiCall) {
            setNftData([])
            setPage(1);
            getNftListFixed()
        }
        setIsOffer(false);
    };

    const handleDialogCloseIsPlaceBid = (apiCall) => {

        if (apiCall) {
            setNftData([])
            setPage(1);
            getNftListAuction()
        }
        setIsPlaceBid(false);
    };
    // handle trx dialog
    function handleDialogClose() {
        setIsTransaction(false)
    }

    const handleOnchageFilter = (event) => {
        setNftData([])
        setFilterType(event.target.value)
        setPage(1)
    }
    //HANDLE CLOSE DIALOG
    function handleDialogCloseForWrongWallet() {
        setIsAddressWrong(false)
        setHasWalletNotConnected(false)
    }

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        if (filterType == 'fixed') {
            getNftListFixed()
        } else {
            getNftListAuction()
        }
    }, [filterType, page])

    return (<>
        {isTransaction && (
            <PopupModals open={true} onDialogClose={handleDialogClose}>
                <TransactionConfirmation
                    onClose={handleDialogClose}
                    message={transactionMessage}
                />
            </PopupModals>
        )}
        {
            isOffer && <PopupModals open={true} onDialogClose={handleDialogCloseIsOffer}>
                <MakeOffer data={offerData} onClose={handleDialogCloseIsOffer} />
            </PopupModals>
        }
        {
            isPlaceBid && <PopupModals open={true} onDialogClose={handleDialogCloseIsPlaceBid}>
                <PlacebidModal data={placeBidData} onClose={handleDialogCloseIsPlaceBid} />
            </PopupModals>
        }

        {
            isAddressWrong && <PopupModals onDialogClose={handleDialogCloseForWrongWallet} open={true}>
                <WrongWalletAddressDialog onClose={handleDialogCloseForWrongWallet} />
            </PopupModals>
        }
        {
            hasWalletNotConnected && <PopupModals onDialogClose={handleDialogCloseForWrongWallet} open={true}>
                <WalletNotConnectedPopup onClose={handleDialogCloseForWrongWallet} />
            </PopupModals>
        }
        <div className='bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full py-3 px-5 '>

            <div className="text-left relative" >
                <Filter className="filter" />
                <select name="" className="bg-transparent" id="" onChange={handleOnchageFilter}>
                    <option value="fixed">Fixed</option>
                    <option value="auction">Auction</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-5">
                <div className="col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 mb-5">
                        {
                            filterType == 'fixed' ?
                                nftData.map((item, index) => <>
                                    <div key={index} className="col-span-1">
                                        <div className=" mt-5" >
                                            <div className='' >
                                                <img src={item.nftImage} alt="" className="nftimage" style={{ margin: "auto" }} />
                                            </div>
                                            <div className=' nftdetails' >
                                                <h2 className='text-left text-lg mt-5 mb-5 font-bold mb-5' >
                                                    {item.name}
                                                </h2>
                                                <div>
                                                    <div className="flex justify-between mb-2" >

                                                        <p className=' listhead' >Minted </p>
                                                        <p className='flex gap-2 truncate listcontent'><Clock12 width={"15px"} style={{ color: "rgb(34 47 27 / 50%)" }} /> {formatUnixFormatDate(item.mintedCreatedDate)}</p>
                                                    </div>
                                                    {/* <div className="flex justify-between" >
    
                                                        <p className=' ' >Traits</p>
                                                        <p className=''>{item.traits}</p>
                                                    </div> */}
                                                    <div className="flex justify-between mb-2" >

                                                        <p className=' listhead' >Owned By </p>
                                                        <p className='flex gap-2 truncate listcontent'><User width={"15px"} style={{ color: "rgb(34 47 27 / 50%)" }} /> {item.username}</p>
                                                    </div>
                                                    {/* <div className="flex justify-between" >
    
                                                        <p className=' ' >Rarity </p>
                                                        <p className=' '>{item.rarity}</p>
                                                    </div> */}
                                                    <div className="flex justify-between mb-2" >

                                                        <p className='listhead' >Value </p>
                                                        <p className=' flex gap-2 truncate listcontent'><CandlestickChart width={"15px"} style={{ color: "rgb(34 47 27 / 50%)" }} /> {parseInt(item.price) / 1e18} QNT</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1" >
                                        <div className="bidbox mt-5" >

                                            <div className='' >
                                                <h2 className='text-left text-lg mb-5 font-bold' >
                                                    Listing Details
                                                </h2>
                                                <div className="mb-5" >
                                                    <div className="flex justify-between " >

                                                        <p className='listhead' >Listed </p>
                                                        <p className='flex gap-2 items-center truncate listcontent'><Clock12 width={"15px"} style={{ color: "rgb(34 47 27 / 50%)" }} />{formatUnixFormatDate(item.timestamp)}</p>
                                                    </div>
                                                </div>
                                                <>
                                                    <div className="flex gap-5 justify-between" >
                                                        <button className='makeofferbutton' onClick={() => purchaseNFTFromFixedSaleFn(item.fixedSaleIndex, item.price)} style={{ margin: '0' }}>Buy Now</button>
                                                        <button className='makeofferbutton' onClick={() => (setOfferData({ ...item, marketPrice: item.price, indexId: item.fixedSaleIndex, owner: { id: item.artist }, mintedCreatedDate: item.mintedCreatedDate, isType: 1 }), setIsOffer(true))} style={{ margin: '0' }}>Make Offer</button>
                                                    </div>
                                                </>
                                            </div>
                                        </div>
                                    </div>
                                </>)
                                : nftData.map((item, index) => <>
                                    <div key={index} className="col-span-1">
                                        <div className="mt-5" >
                                            <div className='' >
                                                <img src={item.nftImage} alt="" className="nftimage" style={{ margin: "auto" }} />
                                            </div>
                                            <div className='nftdetails' >
                                                <h2 className='text-left text-lg mt-5 mb-5  font-bold' >
                                                    {item.name}
                                                </h2>
                                                <div>
                                                    <div className="flex justify-between mb-2" >

                                                        <p className='listhead' >Minted</p>
                                                        <p className='flex gap-2 truncate listcontent'><Clock12 width={"15px"} style={{ color: "rgb(34 47 27 / 50%)" }} /> {formatUnixFormatDate(item.mintedCreatedDate)}</p>
                                                    </div>
                                                    {/* <div className="flex justify-between" >

                                                 <p className=' ' >Traits</p>
                                                 <p className=''>{item.traits}</p>
                                             </div> */}
                                                    <div className="flex justify-between mb-2" >

                                                        <p className='listhead' >Owned By</p>
                                                        <p className='flex gap-2 truncate listcontent'><User width={"15px"} style={{ color: "rgb(34 47 27 / 50%)" }} /> {item.username}</p>
                                                    </div>
                                                    {/* <div className="flex justify-between" >

                                                 <p className=' ' >Rarity </p>
                                                 <p className=' '>{item.rarity}</p>
                                             </div> */}
                                                    <div className="flex justify-between mb-2" >

                                                        <p className='listhead' >Value </p>
                                                        <p className='flex gap-2 truncate listcontent'><CandlestickChart width={"15px"} style={{ color: "rgb(34 47 27 / 50%)" }} /> {parseInt(item.startPrice) / 1e18} QNT</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1" >
                                        <div className="bidbox mt-5" >

                                            <div className='' >
                                                <h2 className='text-left text-lg mb-5  font-bold' >
                                                    Listing Details
                                                </h2>
                                                <div className="mb-5" >
                                                    <div className="flex justify-between" >

                                                        <p className='listhead' >Listed</p>
                                                        <p className='flex gap-2 items-center truncate listcontent'><Clock12 width={"15px"} style={{ color: "rgb(34 47 27 / 50%)" }} /> {formatUnixFormatDate(item.timestamp)}</p>
                                                    </div>
                                                    <div className="flex justify-between" >

                                                        <p className='listhead' >Current Highst Bid</p>
                                                        <p className='flex gap-2 items-center truncate listcontent'><CandlestickChart width={"15px"} style={{ color: "rgb(34 47 27 / 50%)" }} />{parseInt(item.currentHighestBid) / 1e18} QNT</p>
                                                    </div>

                                                    <div className="flex justify-between" >

                                                        <p className='listhead' >Last Bid Submitted </p>
                                                        <p className=' flex gap-2 items-center truncate listcontent'><Clock12 width={"15px"} style={{ color: "rgb(34 47 27 / 50%)" }} />{formatRelativeTime(item.lastBidSubmitted)}</p>
                                                    </div>
                                                    <div className="flex justify-between" >

                                                        <p className='listhead' >Forecast Auction End </p>
                                                        <p className='flex gap-2 items-center truncate listcontent'><Clock12 width={"15px"} style={{ color: "rgb(34 47 27 / 50%)" }} />{auctionEndDays(item.forecastAuctionEnd)}</p>
                                                    </div>
                                                </div>
                                                {/* <FormForBids /> */}
                                                <button className='makeofferbutton' onClick={() => (setPlaceBidData({ ...item, marketPrice: item.startPrice, indexId: item.auctionIndex, owner: { id: item.artist }, mintedCreatedDate: item.mintedCreatedDate }), setIsPlaceBid(true))} style={{ margin: 'auto' }}>Place Bid</button>

                                            </div>
                                        </div>
                                    </div>
                                </>)
                        }

                    </div>
                    {
                        isLoading && <>
                            <div className="col-span-1 m-auto">
                                <SkeletonTheme
                                    baseColor="#82938e"
                                    highlightColor="#3c4d41"
                                    height={320}
                                >
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>
                            <div className="col-span-1 m-auto">
                                <SkeletonTheme
                                    baseColor="#82938e"
                                    highlightColor="#3c4d41"
                                    height={320}
                                >
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>
                        </>
                    }

                </div>
                {
                    nftData == 0 && !isLoading && <>
                        <div className="col-span-3">
                            <img src="assets/datanotfound.svg" alt="" height="200px" width="200px" className="border-0 mx-auto" />
                        </div>
                    </>

                }
                {nftDataLength == PAGE_SIZE && !isLoading && (
                    <div className="flex justify-center">
                        <button className="actionbuttons" onClick={handleLoadMore}>
                            Load More
                        </button>
                    </div>
                )}
            </div>

        </div>
    </>)
}

function MyBidsInfo() {
    const [nftData, setNftData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterType, setFilterType] = useState('fixed')
    const [nftDataLength, setnftDataLength] = useState(0)
    const [page, setPage] = useState(1);
    //get nft list
    const getNftListFixed = async () => {
        try {
            setIsLoading(true)
            const result = await get(`allMyBidFixedNftList?page=${page}&perPage=${PAGE_SIZE}`)
            const newData = result.data.nftData;
            setnftDataLength(newData.length)
            setNftData((prevData) => [...prevData, ...newData]);
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }

    const getNftListAuction = async () => {
        setIsLoading(true)
        try {
            const result = await get(`allMyBidAuctionNftList?page=${page}&perPage=${PAGE_SIZE}`)
            const newData = result.data.nftData;
            setnftDataLength(newData.length)
            setNftData((prevData) => [...prevData, ...newData]);
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }

    const handleLoadMore = () => {
        debugger
        setPage((prevPage) => prevPage + 1);
    };

    const handleOnchageFilter = (event) => {
        setNftData([])
        setFilterType(event.target.value)
        setPage(1)
    }

    useEffect(() => {
        if (filterType == 'fixed') {
            getNftListFixed()
        } else {
            getNftListAuction()
        }
    }, [filterType, page])

    return (<>
        <div className="bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full py-3 px-5" >

            <div className="text-left flex gap-5 relative" >
                <Filter className="filter" />
                <select name="" className="bg-transparent" id="" onChange={handleOnchageFilter} >

                    <option value="fixed">  Fixed</option>
                    <option value="auction">  Auction</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-5 mb-5" >
                <div className="col-span-2">
                    <div key={'ls'} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-5 mb-5">
                        {
                            filterType === 'fixed' ?
                                nftData.map((item, index) => <>
                                    <div key={index} className="col-span-1">
                                        <div className="" >
                                            <div className='imgcover' >
                                                <img src={item.nftImage} alt="" className="nftimage" style={{ margin: "auto" }} />
                                            </div>
                                            <div className='nftdetails' >
                                                <h2 className='text-left text-lg mt-5 font-bold truncate' >
                                                    {item.nftName}
                                                </h2>
                                                <div>
                                                    <div className="flex justify-between mb-2 mt-5" >

                                                        <p className='listhead ' >Minted</p>
                                                        <p className='flex gap-2  truncate listcontent'><Clock12 width={"15px"} style={{ color: "rgb(34 47 27 / 50%)" }} /> {formatUnixFormatDate(item.mintedCreatedDate)}</p>
                                                    </div>
                                                    {/* <div className="flex justify-between" >

                                                    <p className=' ' >Traits</p>
                                                    <p className=''>{item.traits}</p>
                                                </div> */}
                                                    <div className="flex justify-between mb-2" >

                                                        <p className='listheadd' >Owned By</p>
                                                        <p className='truncate listcontent'>{item.username}</p>
                                                    </div>
                                                    {/* <div className="flex justify-between" >

                                                    <p className=' ' >Rarity </p>
                                                    <p className=' '>{item.rarity}</p>
                                                </div> */}
                                                    <div className="flex justify-between mb-2" >

                                                        <p className='listhead' >Value </p>
                                                        <p className=' truncate listcontent'>{isNaN(parseInt(item.price) / 1e18) ? '--' : parseInt(item.price) / 1e18} QNT</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 ">
                                        <div className="bidbox" >

                                            <div className='px-5' >
                                                <h2 className='text-left text-lg  font-bold' >
                                                    Offer Sent
                                                </h2>
                                                <div >
                                                    <div className="flex justify-between " >

                                                        <p className='listhead' >Sent</p>
                                                        <p className=' truncate listcontent'>{formatRelativeTime(item.blockTimestamp)}</p>
                                                    </div>
                                                    <div className="flex justify-between " >

                                                        <p className='listhead' >Amount</p>
                                                        <p className=' truncate listcontent'>{isNaN(parseInt(item.offer) / 1e18) ? '--' : parseInt(item.offer) / 1e18} QNT</p>
                                                    </div>
                                                    {/* <div className="flex justify-between" >

                                                    <p className=' font-bold' >Time remaining until expiry</p>
                                                    <p className=''>{item.remainingTimeToExpire}</p>
                                                </div> */}
                                                    <div className="flex justify-between " >
                                                        <p className='listhead' >Status </p>
                                                        <p className=' truncate listcontent'>{'pending'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>

                                ) : nftData.map((item, index) => <>
                                    <div key={index} className="col-span-1">
                                        <div className="" >
                                            <div className='imgcover' >
                                                <img src={item.nftImage} alt="" className="nftimage" style={{ margin: "auto" }} />
                                            </div>
                                            <div className='nftdetails mt-5' >
                                                <h2 className='text-left text-lg  font-bold' >
                                                    {item.nftName}
                                                </h2>
                                                <div className="mt-5" >
                                                    <div className="flex justify-between mb-2" >

                                                        <p className='font-bold ' >Minted</p>
                                                        <p className='flex gap-2'><Clock12 width={"15px"} style={{ color: "rgb(34 47 27 / 50%)" }} /> {formatUnixFormatDate(item.mintedCreatedDate)}</p>
                                                    </div>
                                                    {/* <div className="flex justify-between" >

                                                <p className=' ' >Traits</p>
                                                <p className=''>{item.traits}</p>
                                            </div> */}
                                                    <div className="flex justify-between mb-2" >

                                                        <p className=' font-bold' >Owned By</p>
                                                        <p className=''>{item.username}</p>
                                                    </div>
                                                    {/* <div className="flex justify-between" >

                                                <p className=' ' >Rarity </p>
                                                <p className=' '>{item.rarity}</p>
                                            </div> */}
                                                    <div className="flex justify-between mb-2" >

                                                        <p className=' font-bold' >Value </p>
                                                        <p className=' '>{isNaN(parseInt(item.price) / 1e18) ? '--' : parseInt(item.price) / 1e18} QNT</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 ">
                                        <div className="bidbox" >

                                            <div className='px-5' >
                                                <h2 className='text-left text-lg  font-bold' >
                                                    Offer Sent
                                                </h2>
                                                <div >
                                                    <div className="flex justify-between " >

                                                        <p className=' font-bold' >Sent</p>
                                                        <p className=''>{formatRelativeTime(item.blockTimestamp)}</p>
                                                    </div>
                                                    <div className="flex justify-between " >

                                                        <p className=' font-bold' >Amount</p>
                                                        <p className=''>{isNaN(parseInt(item.offer) / 1e18) ? '--' : parseInt(item.offer) / 1e18} QNT</p>
                                                    </div>
                                                    {/* <div className="flex justify-between" >

                                                <p className=' font-bold' >Time remaining until expiry</p>
                                                <p className=''>{item.remainingTimeToExpire}</p>
                                            </div> */}
                                                    <div className="flex justify-between " >
                                                        <p className=' font-bold' >Status </p>
                                                        <p className=' '>{'pending'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>

                                )
                        }
                    </div>
                </div>
                {
                    isLoading && <>
                        <div className="col-span-2 m-auto">
                            <SkeletonTheme
                                baseColor="#82938e"
                                highlightColor="#3c4d41"
                                height={320}
                            >
                                <Skeleton count={1} />
                            </SkeletonTheme>
                        </div>

                    </>
                }
                {
                    nftData.length == 0 && !isLoading && <>
                        <div className="col-span-3">
                            <img src="assets/datanotfound.svg" alt="" height="200px" width="200px" className="border-0 mx-auto" />
                        </div>
                    </>

                }
                {nftDataLength == PAGE_SIZE && !isLoading && (
                    <div className="flex justify-center">
                        <button className="actionbuttons" onClick={handleLoadMore}>
                            Load More
                        </button>
                    </div>
                )}
            </div>

        </div>

    </>)
}

export default Bids
