import { useState, useEffect } from "react";
import Header from '../Componant/Common/Header'
import PopupModals from "../Componant/PopupModals";
import ViewList from "../Componant/Popups/ViewList";
import { get } from "../services/apiService";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { formatUnixFormatDate } from "../utils/formatUnixFormatDate";
import { Tooltip } from "@mui/material";

const PAGE_SIZE = 6

function MyPortfolio() {
    const [openDialog, setDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [nftData, setNftData] = useState([])
    const [ownerName, setOwnerName] = useState('')
    const [offsetData, setOffsetData] = useState(null)
    const [nftDataLength, setnftDataLength] = useState(0)
    const [page, setPage] = useState(1);
    const getNftList = async () => {
        try {
            setIsLoading(true)
            const result = await get(`myOwnNft?page=${page}&perPage=${PAGE_SIZE}`)
            const newData = result.data.nftData;
            setnftDataLength(newData.length)
            setNftData((prevData) => [...prevData, ...newData]);
            setOwnerName(result.data.owner)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            console.log(error);
        }
    }

    function handleDialogClose(apiCall) {
        if (apiCall) {
            setNftData([])
            setPage(1);
            getNftList()
        }
        setDialogOpen(false)
    }


    const handleLoadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        getNftList()
    }, [page])

    return (
        <>
            {
                openDialog && <PopupModals open={true} onDialogClose={handleDialogClose}>
                    <ViewList data={offsetData} onClose={handleDialogClose} />
                </PopupModals>
            }
            <div>
                <Header />
                <div className='bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full py-3 px-5 margintop'>
                    <div>
                        <h1 className=' text-left my-4 flex' >My Portfolio</h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5 py-5">
                            {
                                nftData.map((item, index) => <>
                                    <div className="col-span-1 m-auto" key={index}>
                                        <div className="card hovercard border border-700 rounded listcard p-5"  >
                                            <div className='imgcover' >
                                                <img src={item.nftImage} alt="" className="nftimage" style={{ margin: "auto" }} />
                                            </div>
                                            <div className=' nftdetails' >
                                                <h2 className='text-left truncate text-lg mb-5 mt-5 font-bold' >
                                                    {item.name}
                                                </h2>
                                                <div className="grid grid-cols-2 gap-5" >
                                                    <div className="col-span-1" >
                                                        <Tooltip title={formatUnixFormatDate(item.mintedCreatedDate)} arrow>
                                                            <p className='truncate listcontent'>{formatUnixFormatDate(item.mintedCreatedDate)}</p>
                                                        </Tooltip>

                                                        <p className=' listhead' >Minted</p>
                                                    </div>
                                                    {/* <div className="flex justify-between" >

                                                        <p className=' ' >Traits</p>
                                                        <p className=''>{item.traits}</p>
                                                    </div> */}
                                                    <div className="col-span-1" >
                                                        <Tooltip title={ownerName} arrow >
                                                            <p className='  truncate listcontent'>{ownerName}</p>
                                                        </Tooltip>

                                                        <p className=' listhead' >Owned By</p>
                                                    </div>
                                                    {/* <div className="flex justify-between" >

                                                        <p className=' font-bold' >Rarity </p>
                                                        <p className=' '>{item.rarity}</p>
                                                    </div> */}
                                                    {/* <div className="flex justify-between" >

                                                        <p className=' font-bold' >Value </p>
                                                        <p className=' '>{item.value} QNT</p>
                                                    </div> */}
                                                </div>
                                                <div className='flex justify-between mt-5 ' >
                                                    <button className=' makeofferbutton' onClick={() => (setDialogOpen(true), setOffsetData(item))} style={{ margin: 'auto' }}  >List Now</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                )
                            }
                            {
                                isLoading &&
                                <>
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
            </div>
        </>
    )
}

export default MyPortfolio
