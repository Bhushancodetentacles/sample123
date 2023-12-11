import { useEffect, useState } from "react";
import { formatUnixFormatDate } from "../../utils/formatUnixFormatDate";
import TransactionConfirmation from "./TransactionConfirmation";
import PopupModals from "../PopupModals";
import useContractService from "../../hooks/useContractService";
import { useForm } from "react-hook-form";
import Table from "../Table/VTable";
import { get } from "../../services/apiService";
import { auctionEndDays } from "../../utils/auctionEndDays";
import { toast } from "react-toastify";
import { CandlestickChart, Clock12, User } from "lucide-react";
import WrongWalletAddressDialog from "./WrongWalletAddressDialog";
import WalletNotConnectedPopup from "./WalletNotConnectedPopup";
const CHAIN_ID = parseInt(import.meta.env.VITE_APP_CHAIN_ID)
const waitingTime = parseInt(import.meta.env.VITE_APP_WAITING_TIME)
function PlacebidModal({ onClose, data }) {
    console.log(data);

    const { handleMetamaskError, placeNFTAuctionBid, tokenApprovalForMarketPlaceContract,isWalletConnected,isWrongWalletConnected } = useContractService()
    const [isTransaction, setIsTransaction] = useState(false)
    const [transactionMessage, setTransactionMessage] = useState("Please Wait...");
    const [auctionInfoData, setAuctionInfoData] = useState(null)
    const [NFTBidPlacedData, setNFTBidPlacedData] = useState([])
    const [isAddressWrong, setIsAddressWrong] = useState(false)
    const [hasWalletNotConnected, setHasWalletNotConnected] = useState(false)
    const { formState: { errors }, register, handleSubmit } = useForm()

    const getAuctionInfo = async () => {
        try {
            const result = await get(`getAuctionInfo?auctionIndexId=${data.indexId}`)
            setAuctionInfoData(result.data.auctionNftInfo[0])
            setNFTBidPlacedData(result.data.auctionNftInfo[0].NFTBidPlaced)
        } catch (error) {
            console.log(result);
        }
    }

    //place bid on auction
    async function placeNFTAuctionBidFn(items) {
        if (isWrongWalletConnected()) return setIsAddressWrong(true)
        if (!await isWalletConnected(CHAIN_ID)) return setHasWalletNotConnected(true)
        const { bidPrice } = items
        const currentBid = parseInt(auctionInfoData?.currentAuctionBid) / 1e18
        const startPrice = parseInt(auctionInfoData?.startPrice) / 1e18
        const minBidIncrementPercentage = parseFloat(auctionInfoData?.minBidIncrementPercentage)

        if (currentBid > 0) {
            const bidPer = (((currentBid * minBidIncrementPercentage) / 100) + currentBid)
            if (bidPer > parseFloat(bidPrice)) {
                return toast.error(`minimum bid price ${bidPer} or greater`)
            }
        } else {
            // const bidPer = (((startPrice * minBidIncrementPercentage) / 100) + startPrice)
            if (startPrice > parseFloat(bidPrice)) {
                return toast.error(`minimum bid price ${startPrice} or greater`)
            }
        }

        try {
            setIsTransaction(true)
            setTransactionMessage('Waiting For Approval...')
            const approval = await tokenApprovalForMarketPlaceContract(import.meta.env.VITE_APP_NFT_MARKET_PLACE_CONTRACT_ADDRESS, bidPrice)
            if (approval) {
                await approval.wait()
            }
            setTransactionMessage('Waiting For Transaction...')
            const result = await placeNFTAuctionBid(data.indexId, bidPrice)
            setTransactionMessage('Validating Transaction On Blockchain...')
            await result.wait(waitingTime)
            setIsTransaction(false)
            onClose(true)
            toast.success(`the bid has been place success`)
        } catch (error) {
            setIsTransaction(false)
            handleMetamaskError(error)
        }
    }
      //HANDLE CLOSE DIALOG
      function handleDialogCloseForWrongWallet() {
        setIsAddressWrong(false)
        setHasWalletNotConnected(false)
    }

    //HANDLE DIALOG CLOSE
    const handleDialogClose = () => {
        setIsTransaction(false)
    }

    useEffect(() => {
        getAuctionInfo()
    }, [])
    return (
        <>
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
                    <WrongWalletAddressDialog onClose={handleDialogCloseForWrongWallet}/>
                </PopupModals>
            }
              {
                hasWalletNotConnected && <PopupModals onDialogClose={handleDialogCloseForWrongWallet} open={true}>
                    <WalletNotConnectedPopup  onClose={handleDialogCloseForWrongWallet}/>
                </PopupModals>
            }
            <div>
                <img src={data.nftImage} alt="" className='viewimg' style={{ margin: "auto" }} />
            </div>
            <div className='' >
                <h2 className='text-left text-lg mt-5 mb-5' >
                    {data.name}
                </h2>
                <div className="mb-5" >
                    <div className="flex justify-between mb-2" >

                        <p className='font-bold' >Minted</p>
                        <p className='flex gap-2'><Clock12 width={"15px"} style={{ color: "#222f1b8a" }} />{formatUnixFormatDate(data.mintedCreatedDate)}</p>
                    </div>
                    {/* <div className="flex justify-between" >

                                <p className='' >Traits</p>
                                <p className=''>Fearsome, Clawai</p>
                            </div> */}
                    <div className="flex justify-between mb-2" >

                        <p className='font-bold' >Owned By</p>
                        <p className='flex gap-2'><User width={"15px"} style={{ color: "#222f1b8a" }} />{import.meta.env.VITE_APP_NFT_MARKET_PLACE_CONTRACT_ADDRESS?.toLowerCase()==data.owner.id?.toLowerCase() ? 'marketplace':data.username}</p>
                    </div>
                    {/* <div className="flex justify-between" >

                                <p className='' >Rarity </p>
                                <p className=' '>Common</p>
                            </div> */}
                    <div className="flex justify-between mb-2" >

                        <p className='font-bold' >Value </p>
                        <p className=' flex gap-2'><CandlestickChart width={"15px"} style={{ color: "#222f1b8a" }} />{parseInt(data?.marketPrice) / 1e18} QNT</p>
                    </div>

                </div>
                <div className='auctionblock' >
                    <div className="flex justify-between mb-2" >

                        <p className='' >Auction End </p>
                        <p className=' flex gap-2'><Clock12 width={"15px"} style={{ color: "#222f1b8a" }} />{auctionEndDays(auctionInfoData?.endTime)}</p>
                    </div>
                    <div className="flex justify-between mb-2" >
                        <p className='' >Auction Start Price</p>
                        <p className=' flex gap-2'><Clock12 width={"15px"} style={{ color: "#222f1b8a" }} />{parseInt(data?.marketPrice) / 1e18} QNT</p>
                    </div>
                    <div className="flex justify-between mb-2" >
                        <p className='' >Current Offer </p>
                        <p className='flex gap-2 '><CandlestickChart width={"15px"} style={{ color: "#222f1b8a" }} />{isNaN (parseInt(auctionInfoData?.currentAuctionBid) / 1e18)? '--':parseInt(auctionInfoData?.currentAuctionBid) / 1e18} QNT</p>
                    </div>
                    <div className=' mb-4' >
                        <form onSubmit={handleSubmit(placeNFTAuctionBidFn)}>
                            <div className="flex justify-between w-full" >
                                <label htmlFor="" className="w-full" >Enter Amount for Bid</label>
                                <div className="w-full" >
                                <input {...register('bidPrice', {
                                    required: 'this field is required.', pattern: {
                                        value: /^-?\d+(\.\d+)?$/,
                                        message: 'invalid number'
                                    },
                                })} type="text" className="logininput valueinput" autoComplete="off" placeholder='0.0000' />
                                {errors.bidPrice && <><p className=" text-xs text-red-500">{errors.bidPrice.message}</p></>}
                                </div>
                                <p className=' items-center grid p-2' >QNT</p>
                            </div>
                            
                            <div className="text-right mt-5"><button type="submit" className='actionbuttons' style={{ margin: 'auto' }} >Place bid</button></div>
                        </form>
                        
                    </div>
                </div>
            </div>
            <div>
                <OtherBidInfo data={NFTBidPlacedData} />
            </div>
        </>
    )
}

function OtherBidInfo({ data }) {

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0);
    const [perPageItem, setPerPageItem] = useState(10);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const columns = [
        {
            title: "Sr.No.",
            render: (item, index) => (
                <>{page * perPageItem - perPageItem + index + 1}</>
            ),
            key: "srno",
        },
        {
            title: "name",
            dataIndex: "username",
            key: "name",
        },
        {
            title: "Bid Amount",
            render: (item) => <>{parseInt(item.amount) / 1e18} QNT</>,
            key: "amount",
        },
    ];



    //HANDLE PAGE CHANGE
    const handlePageChange = (event, page) => {
        setPage(page);
    };

    //handleRowsPerPageChange
    const handleRowsPerPageChange = (perPage) => {
        setPerPageItem(perPage);
        setPage(1);
    };

    return (<>
        <div id="myTabContent">
            <div className="pt-5 rounded-lg ">
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-5">
                    <div className="col-span-1" >
                        <div className="mt-5" >
                            <Table cols={columns} data={data} page={page} totalPages={totalPages} handlePageChange={handlePageChange} handleRowsPerPageChange={handleRowsPerPageChange} isTableLoading={isTableLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default PlacebidModal;
