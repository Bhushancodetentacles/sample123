import { useState, useEffect } from "react";
import Header from '../Componant/Common/Header'
import PopupModals from "../Componant/PopupModals";
import { get } from "../services/apiService";
import useContractService from "../hooks/useContractService";
import { toast } from "react-toastify";
import TransactionConfirmation from "../Componant/Popups/TransactionConfirmation";
import { formatUnixFormatDate } from "../utils/formatUnixFormatDate";
import OffersMoreInfo from "../Componant/Popups/OffersMoreInfo";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AuctionOffersMoreInfo from "../Componant/Popups/AuctionOffersMoreInfo";
import OffersInfoMyNFT from "../Componant/Popups/OffersInfoMyNFT";
import { useSearchParams } from "react-router-dom";
import { CandlestickChart, Clock12, User } from "lucide-react";
import WrongWalletAddressDialog from "../Componant/Popups/WrongWalletAddressDialog";
import WalletNotConnectedPopup from "../Componant/Popups/WalletNotConnectedPopup";
import { formatRelativeTime } from "../utils/lastBidSubmited";
import { Tooltip } from "@mui/material";
const CHAIN_ID = parseInt(import.meta.env.VITE_APP_CHAIN_ID)
const waitingTime = parseInt(import.meta.env.VITE_APP_WAITING_TIME)
const PAGE_SIZE = 6
function Offers() {
    const [active, setActive] = useState('Fixed')
    const [tabs, setTabs] = useState(["Fixed", "Auction", "Offers"])
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
            <Header />
            <div className="bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full py-3 px-5 margintop">
                <h2 className=" font-bold text-left mt-5 mb-5">My Listing</h2>
                <div className="flex justify-between" >
                    <ul className="flex  -mb-px text-sm font-medium text-center justify-end">
                        {
                            tabs.map(item => <>
                                <li className="mr-2">
                                    <button onClick={() => setURLSearchParams({ tab: item })} className={`inline-block hovereffect text-lg p-2 ${active === item && 'tabborder '}  rounded-t-lg`} type="button">{item}</button>
                                </li>
                            </>
                            )
                        }
                    </ul>
                </div>
            </div>
            {
                active === 'Fixed' ? <FixedSales /> : active === 'Auction' ? <AuctionSales /> : <OffersTab />
            }

        </>
    )
}

const FixedSales = () => {
    const { removeNFTFromFixedSale, handleMetamaskError, isWalletConnected, isWrongWalletConnected } = useContractService()
    const [nftData, setNftData] = useState([])
    const [isTransaction, setIsTransaction] = useState(false)
    const [isMoreInfo, setIsMoreInfo] = useState(false)
    const [offerOffSetData, setOfferOffSetData] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [transactionMessage, setTransactionMessage] = useState("Please Wait...");
    const [imageLoaded, setImageLoaded] = useState(true);
    const [isAddressWrong, setIsAddressWrong] = useState(false)
    const [hasWalletNotConnected, setHasWalletNotConnected] = useState(false)
    const [nftDataLength, setnftDataLength] = useState(0)
    const [page, setPage] = useState(1);
    //get nft list from api
    const getNftList = async () => {
        try {
            setisLoading(true)
            const result = await get(`myFixedSellNftList?page=${page}&perPage=${PAGE_SIZE}`)
            const newData = result.data.nftData;
            setnftDataLength(newData.length)
            setNftData((prevData) => [...prevData, ...newData]);
            setisLoading(false)
        } catch (error) {
            setisLoading(false)
            console.log(error);
        }
    }
    //HANDLE CLOSE DIALOG
    function handleDialogCloseForWrongWallet() {
        setIsAddressWrong(false)
        setHasWalletNotConnected(false)
    }

    //handle remove nft from auction sales
    const removeNFTFromFixedSaleFn = async (_fixedSalesIndex) => {
        if (isWrongWalletConnected()) return setIsAddressWrong(true)
        if (!await isWalletConnected(CHAIN_ID)) return setHasWalletNotConnected(true)
        try {
            setIsTransaction(true)
            setTransactionMessage('Waiting For Transaction...')
            const result = await removeNFTFromFixedSale(_fixedSalesIndex)
            setTransactionMessage('Validating Transaction On Blockchain.')
            await result.wait(waitingTime)
            setIsTransaction(false)
            toast.success('The Nft Remove from Auction.')
        } catch (error) {
            setIsTransaction(false)
            handleMetamaskError(error)
            console.log(error);
        }
    }
    //handle image load
    function handleImageLoad() {
        setImageLoaded(false)
    }

    //handle dialog close
    function handleDialogClose() {
        setIsTransaction(false)
    }
    //handle dialog close
    function handleDialogClose1(apiCall) {
        if (apiCall) {
            setNftData([])
            setPage(1);
            getNftList()
        }
        setIsMoreInfo(false)
    }

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        getNftList()
    }, [page])

    return (<>
        {isMoreInfo && (
            <PopupModals open={true} onDialogClose={handleDialogClose1}>
                <OffersMoreInfo
                    onClose={handleDialogClose1}
                    data={offerOffSetData}
                />
            </PopupModals>
        )}
        {isTransaction && (
            <PopupModals open={true} onDialogClose={handleDialogClose}>
                <TransactionConfirmation
                    onClose={handleDialogClose}
                    message={transactionMessage}
                />
            </PopupModals>
        )}
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
        <div>
            <div className='bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full py-3 px-5 '>
                {
                    nftData.map((item, index) => <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                            <div className="col-span-1">
                                <div className="listwidth" >
                                    <div className='' >
                                        {
                                            imageLoaded ? <>
                                                <SkeletonTheme
                                                    baseColor="#82938e"
                                                    highlightColor="#3c4d41"
                                                    height={200}
                                                >
                                                    <Skeleton count={1} />
                                                </SkeletonTheme>
                                                <div className="imgcover">
                                                    <img src={item.nftImage} className="hidden nftimage" onLoad={handleImageLoad} alt="" style={{ margin: "auto" }} />
                                                </div>

                                            </> :
                                                <div className="imgcover">
                                                    <img src={item.nftImage} alt="" className="nftimage" style={{ margin: "auto" }} />
                                                </div>
                                        }
                                    </div>
                                    <div className='nftdetails ' >
                                        <h2 className='text-left text-lg mt-5 font-bold' >
                                            {item.name}
                                        </h2>
                                        <div className="mt-5" >
                                            <div className="flex justify-between mb-2" >

                                                <p className='listhead ' >Minted </p>
                                                <p className=' flex gap-2 truncate listcontent'> <Clock12 width={"15px"} style={{ color: "rgba(34, 47, 27, 0.5)" }} />{formatUnixFormatDate(item.mintedCreatedDate)}</p>
                                            </div>
                                            {/* <div className="flex justify-between" >
                                                <p className=' ' >Traits</p>
                                                <p className=''>{item.traits}</p>
                                            </div> */}
                                            <div className="flex justify-between mb-2" >

                                                <p className='listhead' >Owned By </p>
                                                <p className=' flex gap-2 truncate listcontent'><User width={"15px"} style={{ color: "rgba(34, 47, 27, 0.5)" }} />{item.owner}</p>
                                            </div>
                                            {/* <div className="flex justify-between" >

                                                <p className=' ' >Rarity </p>
                                                <p className=' '>{item.rarity}</p>
                                            </div>*/}
                                            <div className="flex justify-between mb-2" >
                                                <p className='listhead' >Value </p>
                                                <p className='  flex gap-2 truncate listcontent' ><CandlestickChart width={"15px"} style={{ color: "rgba(34, 47, 27, 0.5)" }} />{parseInt(item.price) / 1e18} QNT</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1" >
                                <div className="bidbox" >

                                    <div className='px-5' >
                                        <h2 className='text-left text-lg   font-bold' >
                                            Listing Details
                                        </h2>
                                        <div className="mt-3" >
                                            <div className="flex justify-between" >
                                                <p className='listhead' >Listed</p>
                                                <p className='flex gap-2 items-center truncate listcontent'><Clock12 width={"15px"} style={{ color: "rgba(34, 47, 27, 0.5)" }} />{formatUnixFormatDate(item.timestamp)}</p>
                                            </div>
                                            {/* <div className="flex justify-between" >

                                                <p className=' font-bold' >Price</p>
                                                <p className=''>{parseInt(item.price) / 1e18} QNT</p>
                                            </div> */}

                                            {/* <div className="flex justify-between" >

                                                <p className=' font-bold' >Last Bid Submitted </p>
                                                <p className=' '>{item.lastBidTime}</p>
                                            </div>
                                            <div className="flex justify-between" >

                                                <p className=' font-bold' >Forecast Auction End </p>
                                                <p className=' text-right'>{item.forecastAuctionEnd}</p>
                                            </div> */}
                                        </div>
                                        <div className='flex justify-between my-4 gap-5' >
                                            <button onClick={() => removeNFTFromFixedSaleFn(item.fixedSaleIndex)} className='makeofferbutton truncate' style={{ margin: '0' }} >Remove From Listing</button>
                                            <button className='makeofferbutton' onClick={() => (setIsMoreInfo(true), setOfferOffSetData(item))} style={{ margin: '0' }} >More Info</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>)
                }

                {
                    isLoading && <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                            <div className="col-span-1">

                                <SkeletonTheme
                                    baseColor="#82938e"
                                    highlightColor="#3c4d41"
                                    height={320}
                                >
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>
                            <div className="col-span-1">

                                <SkeletonTheme
                                    baseColor="#82938e"
                                    highlightColor="#3c4d41"
                                    height={320}
                                >
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>
                        </div>
                    </>
                }
                {
                    nftData.length == 0 && !isLoading &&
                    <div className="">
                        <img src="assets/datanotfound.svg" alt="" height="200px" width="200px" className="border-0 mx-auto" />
                    </div>
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

const AuctionSales = () => {
    const { removeNFTFromAuction, acceptNFTAuctionHighestBid, handleMetamaskError, isWalletConnected, isWrongWalletConnected } = useContractService()
    const [nftData, setNftData] = useState([])
    const [isMoreInfo, setIsMoreInfo] = useState(false)
    const [isTransaction, setIsTransaction] = useState(false)
    const [transactionMessage, setTransactionMessage] = useState("Please Wait...");
    const [offerOffSetData, setOfferOffSetData] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [isAddressWrong, setIsAddressWrong] = useState(false)
    const [hasWalletNotConnected, setHasWalletNotConnected] = useState(false)
    const [nftDataLength, setnftDataLength] = useState(0)
    const [page, setPage] = useState(1);
    //get nft list from api
    const getNftList = async () => {
        try {
            setisLoading(true)
            const result = await get(`myAuctionSellNftList?page=${page}&perPage=${PAGE_SIZE}`)
            const newData = result.data.nftData;
            setnftDataLength(newData.length)
            setNftData((prevData) => [...prevData, ...newData]);
            setNftData(result.data.nftData)
            setisLoading(false)

        } catch (error) {
            setisLoading(false)

            console.log(error);
        }
    }

    //handle remove nft from auction sales
    const removeNFTFromAuctionFn = async (_auctionIndex) => {
        if (isWrongWalletConnected()) return setIsAddressWrong(true)
        if (!await isWalletConnected(CHAIN_ID)) return setHasWalletNotConnected(true)
        try {
            setIsTransaction(true)
            setTransactionMessage('Waiting For Transaction...')
            const result = await removeNFTFromAuction(_auctionIndex)
            setTransactionMessage('Validating Transaction On Blockchain.')
            await result.wait(waitingTime)
            setIsTransaction(false)
            toast.success('The Nft Remove from Auction.')
        } catch (error) {
            setIsTransaction(false)
            handleMetamaskError(error)
            console.log(error);
        }
    }
    //handle remove nft from auction sales
    const acceptNFTAuctionHighestBidFn = async (_auctionIndex) => {
        if (isWrongWalletConnected()) return setIsAddressWrong(true)
        if (!await isWalletConnected(CHAIN_ID)) return setHasWalletNotConnected(true)
        try {
            setIsTransaction(true)
            setTransactionMessage('Waiting For Transaction...')
            const result = await acceptNFTAuctionHighestBid(_auctionIndex)
            setTransactionMessage('Validating Transaction On Blockchain.')
            await result.wait(waitingTime)
            setIsTransaction(false)
            toast.success('The Nft Remove from Auction.')
        } catch (error) {
            setIsTransaction(false)
            handleMetamaskError(error)
            console.log(error);
        }
    }
    //handle dialog close
    function handleDialogClose() {
        setIsTransaction(false)
    }
    //handle dialog close
    function handleDialogClose1(apiCall) {
        if (apiCall) {
            setNftData([])
            setPage(1);
            getNftList()
        }
        setIsMoreInfo(false)
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
        getNftList()
    }, [page])
    return (<>
        {isMoreInfo && (
            <PopupModals open={true} onDialogClose={handleDialogClose1}>
                <AuctionOffersMoreInfo
                    onClose={handleDialogClose1}
                    data={offerOffSetData}
                />
            </PopupModals>
        )}
        {
            isTransaction && (
                <PopupModals open={true} onDialogClose={handleDialogClose}>
                    <TransactionConfirmation
                        onClose={handleDialogClose}
                        message={transactionMessage}
                    />
                </PopupModals>
            )}

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
        <div>
            <div className='bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full py-3 px-5'>
                {
                    nftData.map((item, index) => <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                            <div className="col-span-1">
                                <div className="listwidth" >
                                    <div className='imgcover' >
                                        <img src={item.nftImage} alt="" className="nftimage" style={{ margin: "auto" }} />
                                    </div>
                                    <div className=' nftdetails' >
                                        <h2 className='text-left text-lg mt-5  mb-5 font-bold' >
                                            {item.name}
                                        </h2>
                                        <div>
                                            <div className="flex justify-between mb-2" >

                                                <p className=' listhead' >Minted </p>
                                                <p className='flex gap-2 truncate listcontent'><Clock12 width={"15px"} style={{ color: "rgba(34, 47, 27, 0.5)" }} />{formatUnixFormatDate(item.mintedCreatedDate)}</p>
                                            </div>
                                            {/* <div className="flex justify-between" >

                                                <p className=' ' >Traits</p>
                                                <p className=''>{item.traits}</p>
                                            </div> */}
                                            <div className="flex justify-between mb-2" >

                                                <p className='listhead' >Owned By </p>
                                                <p className='flex gap-2 truncate listcontent'><User width={"15px"} style={{ color: "rgba(34, 47, 27, 0.5)" }} />{item.owner}</p>
                                            </div>
                                            {/* <div className="flex justify-between" >

                                                <p className=' ' >Rarity </p>
                                                <p className=' '>{item.rarity}</p>
                                            </div>
                                            */}
                                            <div className="flex justify-between mb-2" >

                                                <p className='listhead' >Value  </p>
                                                <p className=' flex gap-2 truncate listcontent'><CandlestickChart width={"15px"} style={{ color: "rgba(34, 47, 27, 0.5)" }} />{parseInt(item.price) / 1e18} QNT</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1" >
                                <div className="bidbox" >

                                    <div className='' >
                                        <h2 className='text-left text-lg  font-bold' >
                                            Listing Details
                                        </h2>
                                        <div >
                                            <div className="flex justify-between" >

                                                <p className='listhead' >Listed</p>
                                                <p className='flex gap-2 items-center truncate listcontent'><Clock12 width={"15px"} style={{ color: "rgba(34, 47, 27, 0.5)" }} />{formatUnixFormatDate(item?.timestamp)}</p>
                                            </div>
                                            <div className="flex justify-between" >

                                                <p className='listhead' >Current Highst Bid</p>
                                                <p className='flex gap-2 items-center truncate listcontent'><CandlestickChart width={"15px"} style={{ color: "rgba(34, 47, 27, 0.5)" }} />{item?.currentHighestBid} QNT</p>
                                            </div>
                                            {/* <div className="flex justify-between" >

                                                    <p className=' font-bold' >Your Highest Bid</p>
                                                    <p className=''>{item.listed} QNT</p>
                                                </div> */}
                                            <div className="flex justify-between" >

                                                <p className='listhead' >Last Bid Submitted </p>
                                                <p className=' flex gap-2 items-center truncate listcontent'>{formatRelativeTime(item?.lastBidSubmitted)}</p>
                                            </div>
                                            <div className="flex justify-between" >

                                                <p className='listhead text-left'  >Forecast Auction End </p>
                                                <p className=' flex  gap-2 items-center text-right truncate listcontent' style={{ lineHeight: "normal" }}><Clock12 width={"15px"} style={{ color: "rgba(34, 47, 27, 0.5)" }} />{formatUnixFormatDate(item?.forecastAuctionEnd)}</p>
                                            </div>
                                        </div>
                                        <div className='flex justify-between gap-5 mt-5' >
                                            <button onClick={() => removeNFTFromAuctionFn(item.auctionIndex)} className='makeofferbutton' style={{ margin: '0' }} >End Now</button>
                                            <button onClick={() => acceptNFTAuctionHighestBidFn(item.auctionIndex)} className='makeofferbutton truncate' style={{ margin: '0' }} >Accept Highest Bid</button>
                                            <button className='makeofferbutton' onClick={() => (setIsMoreInfo(true), setOfferOffSetData(item))} style={{ margin: '0' }} >More Info</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>)
                }

                {
                    isLoading && <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                            <div className="col-span-1">

                                <SkeletonTheme
                                    baseColor="#82938e"
                                    highlightColor="#3c4d41"
                                    height={320}
                                >
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>
                            <div className="col-span-1">

                                <SkeletonTheme
                                    baseColor="#82938e"
                                    highlightColor="#3c4d41"
                                    height={320}
                                >
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>
                        </div>
                    </>
                }
                {
                    nftData.length == 0 && !isLoading &&
                    <div className="">
                        <img src="assets/datanotfound.svg" alt="" height="200px" width="200px" className="border-0 mx-auto" />
                    </div>
                }
                  {nftDataLength==PAGE_SIZE && !isLoading && (
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

const OffersTab = () => {
    const [nftData, setNftData] = useState([])
    const [isMoreInfo, setIsMoreInfo] = useState(false)
    const [offsetData, setOffsetData] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [nftDataLength, setnftDataLength] = useState(0)
    const [page, setPage] = useState(1);
    //get nft list from api
    const getNftList = async () => {
        try {
            setisLoading(true)
            const result = await get(`myOffersSellNftList?page=${page}&perPage=${PAGE_SIZE}`)
            const newData = result.data.nftData;
            setnftDataLength(newData.length)
            setNftData((prevData) => [...prevData, ...newData]);
            setisLoading(false)
        } catch (error) {
            setisLoading(false)
            console.log(error);
        }
    }

  
    //handle dialog close
    function handleDialogClose(apiCall) {
        if (apiCall) {
            setNftData([])
            setPage(1);
            getNftList()
        }
        setIsMoreInfo(false)
    }

    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };
    
    useEffect(() => {
        getNftList()
    }, [page])
    return (<>
        {isMoreInfo && (
            <PopupModals open={true} onDialogClose={handleDialogClose}>
                <OffersInfoMyNFT
                    onClose={handleDialogClose}
                    data={offsetData}
                />
            </PopupModals>
        )}
        <div>
            <div className='bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full py-3 px-5'>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                    {
                        nftData.map((item, index) => <>
                            <div className="col-span-1">
                                <div className="listwidth hovercard card p-5"  >
                                    <div className='imgcover' >
                                        <img src={item.nftImage} alt="" className="nftimage" style={{ margin: "auto" }} />
                                    </div>
                                    <div className='mt-5 nftdetails' >
                                        <h2 className='text-left text-lg  font-bold' >
                                            {item.nftName}
                                        </h2>
                                        <div className="grid grid-cols-2 gap-5 mt-5" >
                                            <div className="col-span-1" >


                                                <Tooltip title={formatUnixFormatDate(item.mintedCreatedDate)} arrow>
                                                    <p className='flex gap-2 justify-center truncate'>{formatUnixFormatDate(item.mintedCreatedDate)}</p>
                                                </Tooltip>
                                                <p className=' ' >Minted</p>
                                            </div>
                                            {/* <div className="flex justify-between" >

                                                <p className=' ' >Traits</p>
                                                <p className=''>{item.traits}</p>
                                            </div> */}
                                            <div className="col-span-1" >


                                                <Tooltip title={item.username} arrow >
                                                    <p className=' justify-center truncate'>{item.username}</p>
                                                </Tooltip>
                                                <p className=' text-center' >Owned By</p>
                                            </div>
                                            {/* <div className="flex justify-between" >

                                                <p className=' ' >Rarity </p>
                                                <p className=' '>{item.rarity}</p>
                                            </div>
                                            */}

                                        </div>
                                        <div className="">
                                            <button className='makeofferbutton' onClick={() => (setIsMoreInfo(true), setOffsetData(item))} style={{ margin: ' 10px auto' }} >More Info</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>)
                    }
                </div>




                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                    {
                        isLoading && <>
                            <div className="col-span-1">

                                <SkeletonTheme
                                    baseColor="#82938e"
                                    highlightColor="#3c4d41"
                                    height={320}
                                >
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>
                            <div className="col-span-1">

                                <SkeletonTheme
                                    baseColor="#82938e"
                                    highlightColor="#3c4d41"
                                    height={320}
                                >
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>
                            <div className="col-span-1">

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
                    nftData.length == 0 && !isLoading &&
                    <div className="">
                        <img src="assets/datanotfound.svg" alt="" height="200px" width="200px" className="border-0 mx-auto" />
                    </div>
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
export default Offers