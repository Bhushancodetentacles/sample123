import { Tooltip } from '@mui/material';
import { Check, X } from 'lucide-react';
import React, { useState } from 'react'
import Table from '../Table/VTable';
import { useEffect } from 'react';
import { get } from '../../services/apiService';
import useContractService from '../../hooks/useContractService';
import PopupModals from '../PopupModals';
import TransactionConfirmation from './TransactionConfirmation';
import WrongWalletAddressDialog from './WrongWalletAddressDialog';
import WalletNotConnectedPopup from './WalletNotConnectedPopup';
const CHAIN_ID = parseInt(import.meta.env.VITE_APP_CHAIN_ID)
const waitingTime = parseInt(import.meta.env.VITE_APP_WAITING_TIME)
function OffersMoreInfo({ data,onClose }) {
    const { acceptOfferForFixedSaleNFTFn, handleMetamaskError,isWalletConnected,isWrongWalletConnected } = useContractService()
    const [offersData, setOffersData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0);
    const [perPageItem, setPerPageItem] = useState(10);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [isTransaction, setIsTransaction] = useState(false)
    const [transactionMessage, setTransactionMessage] = useState("Please Wait...");
    const [isAddressWrong, setIsAddressWrong] = useState(false)
    const [hasWalletNotConnected, setHasWalletNotConnected] = useState(false)
    const getFixedOffersData = async () => {
        try {
            setIsTableLoading(true)
            const result = await get(`fixedNftUserBidList?fixedSaleIndex=${data.fixedSaleIndex}`)
            setOffersData(result.data.nftFixedBidOffers)
            // setTotalPages(result.data.lastPage)
            setIsTableLoading(false)
        } catch (error) {
            setIsTableLoading(false)
            console.log(error);
        }
    }


    //HANDLE PAGE CHANGE
    const handlePageChange = (event, page) => {
        setPage(page);
    };
    //HANDLE DIALOG CLOSE
    const handleDialogClose = () => {
        setIsTransaction(false)
    }
    //handleRowsPerPageChange
    const handleRowsPerPageChange = (perPage) => {
        setPerPageItem(perPage);
        setPage(1);
    };

    //HANDLE CLOSE DIALOG
    function handleDialogCloseForWrongWallet() {
        setIsAddressWrong(false)
        setHasWalletNotConnected(false)
    }

    //accept offer call contract fn
    async function acceptOfferForFixedSaleNFT(items) {
        const { fixedSaleIndex, offerer } = items
        if (isWrongWalletConnected()) return setIsAddressWrong(true)
        if (!await isWalletConnected(CHAIN_ID)) return setHasWalletNotConnected(true)
        try {
            setIsTransaction(true)
            setTransactionMessage('Waiting For Transaction...')
            const result = await acceptOfferForFixedSaleNFTFn(fixedSaleIndex, offerer)
            setTransactionMessage('Validating Transaction On Blockchain.')
            await result.wait(waitingTime)
            setIsTransaction(false)
            onClose(true)
        } catch (error) {
            setIsTransaction(false)
            handleMetamaskError(error)
        }
    }
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
            title: "offer",
            render: (item) => <>{parseInt(item.offer) / 1e18} QNT</>,
            key: "offer",
        },
        {
            title: "Action",
            render: (item) => (
                <>
                    <div className="flex gap-2 justify-center">
                        <Tooltip title="Accept" arrow>
                            <button className="rounded-sm truncate" onClick={() => acceptOfferForFixedSaleNFT(item)}>
                                <Check className="actiontransition" />
                            </button>
                        </Tooltip>
                    </div>
                </>
            ),
            key: "action",
        },
    ];

    useEffect(() => {
        getFixedOffersData()
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
                    <WrongWalletAddressDialog onClose={handleDialogCloseForWrongWallet} />
                </PopupModals>
            }
            {
                hasWalletNotConnected && <PopupModals onDialogClose={handleDialogCloseForWrongWallet} open={true}>
                    <WalletNotConnectedPopup onClose={handleDialogCloseForWrongWallet} />
                </PopupModals>
            }

            <div id="myTabContent">
                <div className="pt-5 rounded-lg ">
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-5">
                        <div className="col-span-1" >
                            <div className="mt-5" >
                                <Table cols={columns} data={offersData} page={page} totalPages={totalPages} handlePageChange={handlePageChange} handleRowsPerPageChange={handleRowsPerPageChange} isTableLoading={isTableLoading} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OffersMoreInfo