
import { useState, useEffect } from "react";
import Header from '../Componant/Common/Header';
import { MoveLeft } from 'lucide-react'
import { Link, useParams } from "react-router-dom";
import { get } from "../services/apiService";
import { formatDate } from "../utils/formatDate";
import { formatUnixFormatDate } from "../utils/formatUnixFormatDate";
import PopupModals from "../Componant/PopupModals";
import MakeOffer from "../Componant/Popups/MakeOffer";
import PlacebidModal from "../Componant/Popups/PlacebidModal";
import useContractService from "../hooks/useContractService";
import TransactionConfirmation from "../Componant/Popups/TransactionConfirmation";
import WrongWalletAddressDialog from "../Componant/Popups/WrongWalletAddressDialog";
import { Tooltip } from "@mui/material";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
const CHAIN_ID = parseInt(import.meta.env.VITE_APP_CHAIN_ID)
const waitingTime = parseInt(import.meta.env.VITE_APP_WAITING_TIME)
const PAGE_SIZE = 2
// async function fetchAdditionalData(nftContract, itemId) {
//   // Replace this with your actual API call to fetch additional data
//   const result = await axios.post(import.meta.env.VITE_APP_SUBGRAPH_URL, {
//     "query": `{\n  nftlistedForSales(\n    where: {nftContract: \"${nftContract}\", tokenId: \"${itemId}\"}\n  ) {\n    price\n    timestamp\n    isEnded\n    fixedSaleIndex\n    nftContract\n    tokenId\n    tokenContract\n    transactionHash\n  }\n}`
//   })
//   return result.data.data?.nftlistedForSales || []
// }



function ViewCollection() {

  const { purchaseNFTFromFixedSale, tokenApprovalForMarketPlaceContract, isWrongWalletConnected, isWalletConnected, handleMetamaskError } = useContractService()
  const { id } = useParams()
  const [collectionData, setCollectionData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOffer, setIsOffer] = useState(false)
  const [isPlaceBid, setIsPlaceBid] = useState(false)
  const [offerData, setOfferData] = useState(null)
  const [placeBidData, setPlaceBidData] = useState(null)
  const [nftListData, setNftListData] = useState([])
  // const [additionalData, setAdditionalData] = useState([])
  const [nftDataLength, setnftDataLength] = useState(0)
  const [page, setPage] = useState(1);
  const [isTransaction, setIsTransaction] = useState(false)
  const [transactionMessage, setTransactionMessage] = useState("Please Wait...");
  const [isAddressWrong, setIsAddressWrong] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(true);

  const getCollectionInfo = async () => {
    try {
      const result = await get(`userViewCollection?collectionId=${id}`)
      setCollectionData(result.data)
    } catch (error) {
      console.log(error);
    }
  }

  const getNftList = async () => {
    try {
      setIsLoading(true)
      const result = await get(`nftListByCollectionId?collectionId=${id}&page=${page}&perPage=${PAGE_SIZE}`)
      const newData = result.data.nftData;
      setnftDataLength(newData.length)
      setNftListData((prevData) => [...prevData, ...newData]);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  }
  //handle image load
  function handleImageLoad() {
    setImageLoaded(false)
  }

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
};

  const handleDialogCloseIsOffer = (apiCall) => {
    if (apiCall) {
      setNftListData([])
      setPage(1);
      getNftList()
  }
    setIsOffer(false);
  };

  const handleDialogCloseIsPlaceBid = (apiCall) => {
    if (apiCall) {
      setNftListData([])
      setPage(1);
      getNftList()
  }
    setIsPlaceBid(false);
  };

  //purchase nft from fixed sale 
  const purchaseNFTFromFixedSaleFn = async (_fixedSaleIndex, price) => {
    if (isWrongWalletConnected()) return setIsAddressWrong(true)
    if (!await isWalletConnected(CHAIN_ID)) return
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

  // handle trx dialog
  function handleDialogClose() {
    setIsTransaction(false)
  }
  //HANDLE CLOSE DIALOG
  function handleDialogCloseForWrongWallet() {
    setIsAddressWrong(false)
  }
  useEffect(() => {
    getNftList()
  }, [page])


  useEffect(() => {
    getCollectionInfo()
  }, [])

  // useEffect(() => {
  //   const fetchAdditionalDataForAllItems = async () => {
  //     const additionalDataPromises = nftListData.map((item) => fetchAdditionalData(collectionData?.collectionAddress, item.tokenID));
  //     const additionalDataResults = await Promise.all(additionalDataPromises);
  //     setAdditionalData(...additionalDataResults);
  //   };

  //   if (nftListData.length > 0) {
  //     fetchAdditionalDataForAllItems();
  //   }

  // }, [nftListData])

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
      <div>
        <Header />
        <div className='bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full py-3 px-5 margintop'>
          <Link to="/dashboard" > <MoveLeft style={{ color: "white" }} /></Link>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              {
                imageLoaded ? <>
                  <SkeletonTheme
                    baseColor="#82938e"
                    highlightColor="#3c4d41"
                    height={200}
                  >
                    <Skeleton count={1} />
                  </SkeletonTheme>
                  <img src={collectionData?.collectionImage} className="hidden" onLoad={handleImageLoad} alt="" style={{ margin: "auto" }} />

                </> :
                  <img src={collectionData?.collectionImage} className="nftimage" alt="" style={{ margin: "auto" }} />
              }
            </div>
            <div>
              <h1 className='text-left text-lg truncate font-bold' >{collectionData?.collectionName}</h1>
              <div>
                <div className="flex justify-between mt-5">
                  <p className='  listhead' >Created</p>
                  <p className='  truncate listcontent'>{formatDate(collectionData?.createdAt)}</p>
                </div>
                <div className="flex justify-between mt-3">
                  <p className='  listhead' >Minted</p>
                  <p className='  truncate listcontent'>{collectionData?.minthedNft} / {collectionData?.totalNft}</p>
                </div>
                <div className="flex justify-between mt-3">
                  <p className='  listhead' >Floor Price</p>
                  <p className='  truncate listcontent'>{parseInt(collectionData?.floorPrice) / 1e18 || 0} QNT</p>
                </div>
                <div className="flex justify-between mt-3">
                  <p className=' listhead'  >Unique Owners</p>
                  <p className=' truncate listcontent'>{collectionData?.ownerCount}</p>
                </div>
              </div>
            </div>
            <div>
            </div>
          </div>
          <div>
            <h2 className='text-left  font-bold text-2xl mb-3 mt-5' >About This Collection</h2>
            <p className=' text-left text-sm text-medium' >
              {collectionData?.description}
            </p>
          </div>
          {
            <>
              <div>
                <h2 className=' text-left my-4 text-bold' >NFT's</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-5">
                  {
                    nftListData.map((item, index) =>
                      <>
                        <div className="col-span-1 m-auto">
                          <div className="card hovercard  rounded p-5" style={{ margin: 'auto' }}>
                            <div className="imgcover" >
                              <img src={item.nftImage} alt="" className="nftimage" style={{ margin: "auto" }} />
                            </div>
                            <div className='' >
                              <h2 className='text-left text-lg mt-5 truncate  font-bold' >
                                {item.name}
                              </h2>
                              <div className="grid grid-cols-3 gap-3 mt-5">
                                <div className="col-span-1 ">
                                  <Tooltip title={formatUnixFormatDate(item.mintedCreatedDate)} arrow>
                                    <p className='truncate listcontent'>{formatUnixFormatDate(item.mintedCreatedDate)}</p>
                                  </Tooltip>

                                  <p className='listhead'>Minted</p>
                                </div>
                                <div className="col-span-1 ">
                                <Tooltip title={(item.owner.id?.toLowerCase() == import.meta.env.VITE_APP_NFT_MARKET_PLACE_CONTRACT_ADDRESS?.toLowerCase()) ? 'MarketPlace' : item.username} arrow>
                                <p className='truncate listcontent'>{(item.owner.id?.toLowerCase() == import.meta.env.VITE_APP_NFT_MARKET_PLACE_CONTRACT_ADDRESS?.toLowerCase()) ? 'MarketPlace' : item.username}</p>
                                  </Tooltip>
                                  <p className='listhead'>Owned By</p>
                                </div>
                                <div className="col-span-1 ">
                                <Tooltip title={isNaN(parseInt(item.marketPrice) / 1e18) ? '--' : (parseInt(item.marketPrice) / 1e18) == 0 ? '--' : parseInt(item.marketPrice) / 1e18} arrow>
                                <p className='truncate listcontent'>{isNaN(parseInt(item.marketPrice) / 1e18) ? '--' : (parseInt(item.marketPrice) / 1e18) == 0 ? '--' : parseInt(item.marketPrice) / 1e18}</p>
                                  </Tooltip>
                                  <p className='listhead'>Value</p>
                                </div>
                              </div>
                              <div className='flex justify-between mt-5 gap-3' >
                                {
                                  item.saleType == 2 ? (
                                    <>
                                      <button className='makeofferbutton' onClick={() => purchaseNFTFromFixedSaleFn(item.indexId, item.marketPrice)} style={{ margin: '0' }}>Buy Now</button>
                                      <button className='makeofferbutton' onClick={() => (setOfferData({ ...item, isType: 1 }), setIsOffer(true))} style={{ margin: '0' }}>Make Offer</button>
                                    </>
                                  ) : item.saleType == 1 ? (
                                    <button className='makeofferbutton' onClick={() => (setPlaceBidData(item), setIsPlaceBid(true))} style={{ margin: 'auto' }}>Place Bid</button>
                                  ) : (
                                    <button className='makeofferbutton' onClick={() => (setOfferData({ ...{ ...item, nftContract: collectionData?.collectionAddress, isType: 2 } }), setIsOffer(true))} style={{ margin: 'auto' }}>Make Offer</button>
                                  )
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  }
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
                  {
                    nftListData.length == 0 && !isLoading && <>
                      <div className="col-span-3">
                        <img src="/assets/datanotfound.svg" alt="" height="200px" width="200px" className="border-0 mx-auto" />
                      </div>
                    </>
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
            </>
          }
        </div>
      </div>
    </>
  )
}

export default ViewCollection
