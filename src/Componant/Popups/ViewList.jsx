import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useContractService from "../../hooks/useContractService";
import PopupModals from "../PopupModals";
import TransactionConfirmation from "./TransactionConfirmation";
import WrongWalletAddressDialog from "./WrongWalletAddressDialog";
import WalletNotConnectedPopup from "./WalletNotConnectedPopup";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
const CHAIN_ID = parseInt(import.meta.env.VITE_APP_CHAIN_ID)
const waitingTime = parseInt(import.meta.env.VITE_APP_WAITING_TIME)
function ViewList({ data, onClose }) {
    const { nftImage, name, nftId, collectionAddress } = data;
    const { listNFTForFixedSale, listNFTApproval, listNFTForAuction, handleMetamaskError, isWrongWalletConnected, isWalletConnected } = useContractService()
    const [tabs, setTabs] = useState(['Fixed', 'Auction'])
    const [active, setActive] = useState('Fixed')
    const [isTransaction, setIsTransaction] = useState(false)
    const [transactionMessage, setTransactionMessage] = useState("Please Wait...");
    const [isAddressWrong, setIsAddressWrong] = useState(false)
    const [hasWalletNotConnected, setHasWalletNotConnected] = useState(false)
    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm();

    const onSubmit = (formData) => {
        // Handle the form data here based on the formData object
        if (active === "Fixed") {
            // Handle fixed price listing
            listNFTForFixedSaleFn(formData)
        } else {
            // Handle auction listing
            listNFTForAuctionFn(formData)
        }
    };

    const listNFTForFixedSaleFn = async (formData) => {
        const { price } = formData;
        if (isWrongWalletConnected()) return setIsAddressWrong(true)
        if (!await isWalletConnected(CHAIN_ID)) return setHasWalletNotConnected(true)
        setIsTransaction(true)
        try {
            setTransactionMessage('Waiting For Approval...')
            const approval = await listNFTApproval(collectionAddress, import.meta.env.VITE_APP_NFT_MARKET_PLACE_CONTRACT_ADDRESS, nftId)
            setTransactionMessage('Waiting For Transaction...')
            if (approval) {
                await approval.wait()
            }
            const result = await listNFTForFixedSale(nftId, price, collectionAddress)
            setTransactionMessage('Validating Transaction On Blockchain.')
            await result.wait(waitingTime)
            console.log(result);
            setIsTransaction(false)
            onClose(true)
        } catch (error) {
            setIsTransaction(false)
            console.log(error);
            handleMetamaskError(error)
        }
    }
    const listNFTForAuctionFn = async (formData) => {
        const { startPrice, minBidIncrementPercentage, auctionEnd } = formData;
        if (isWrongWalletConnected()) return setIsAddressWrong(true)
        if (!await isWalletConnected(CHAIN_ID)) return setHasWalletNotConnected(true)
        //auction end time in seconds
        const auctionEndTime = Math.floor((new Date(auctionEnd).getTime() - new Date().getTime()) / 1000)
        setIsTransaction(true)
        try {
            setTransactionMessage('Waiting For Approval...')
            const approval = await listNFTApproval(collectionAddress, import.meta.env.VITE_APP_NFT_MARKET_PLACE_CONTRACT_ADDRESS, nftId)
            setTransactionMessage('Waiting For Transaction...')
            if (approval) {
                await approval.wait()
            }
            const result = await listNFTForAuction(nftId, startPrice, minBidIncrementPercentage, auctionEndTime, collectionAddress)
            setTransactionMessage('Validating Transaction On Blockchain.')
            await result.wait(waitingTime)
            console.log(result);
            setIsTransaction(false)
            onClose(true)
        } catch (error) {
            setIsTransaction(false)
            console.log(error);
            handleMetamaskError(error)
        }
    }

    //HANDLE CLOSE DIALOG
    function handleDialogClose() {
        setIsTransaction(false)
    }
    //HANDLE CLOSE DIALOG
    function handleDialogCloseForWrongWallet() {
        setIsAddressWrong(false)
        setHasWalletNotConnected(false)
    }

    return (
        <div>
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
                <img src={nftImage} alt="" className='viewimg' style={{ margin: "auto" }} />
            </div>
            <h1 className="mt-4">{name}</h1>
            <h2 className="mt-5 mb-5">List Now</h2>

            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="flex justify-between" >
                    <ul className="flex  -mb-px text-sm font-medium text-center justify-end">
                        {
                            tabs.map(item => <>
                                <li className="mr-2">
                                    <button onClick={() => setActive(item)} className={`inline-block  text-lg p-2 ${active === item && 'tabborder '}  rounded-t-lg`} type="button">{item}</button>
                                </li>
                            </>
                            )
                        }
                    </ul>
                </div>
                {
                    active === 'Fixed' ? <>

                        <div className="mb-5 mt-5">
                            <div>
                                <label for="price" className="block  text-sm font-light text-left ">Price</label>

                                <input
                                    {...register('price', {
                                        required: 'this field is required.',
                                        pattern: {
                                            value: /^-?\d+(\.\d+)?$/,
                                            message: 'Amount should only contain numbers',
                                        },
                                    })}
                                    type="text"
                                    placeholder="0.000"
                                    className="mintinput"
                                />
                            </div>

                            {errors?.price && <><span style={{ color: 'red' }}>{errors?.price?.message}</span></>}
                        </div>
                    </> :
                        <>

                            <div className="mb-5 mt-5">
                                <label htmlFor="startPrice" className="block  text-sm font-light text-left ">Start Price</label>

                                <input
                                    {...register('startPrice', {
                                        required: 'this field is required.', pattern: {
                                            value: /^-?\d+(\.\d+)?$/,
                                            message: 'Amount should only contain numbers',
                                        },
                                    })}
                                    type="text"
                                    placeholder="0.000"
                                    className="mintinput"
                                />
                                {errors?.startPrice && <><span style={{ color: 'red' }}>{errors?.startPrice?.message}</span></>}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="price" className="block  text-sm font-light text-left ">Minimum bid increment percentage</label>

                                <input
                                    {...register('minBidIncrementPercentage', { required: 'this field is required.' })}
                                    type="text"
                                    placeholder="Minimum bid increment percentage"
                                    className="mintinput"
                                />
                                {errors?.minBidIncrementPercentage && <><span style={{ color: 'red' }}>{errors?.minBidIncrementPercentage?.message}</span></>}
                            </div>
                            <div className="mb-5">
                                <label htmlFor="price" className="block  text-sm font-light text-left ">Auction End</label>

                                <Controller
                                    name="auctionEnd"
                                    control={control}
                                    render={({ field }) => {
                                        return <DatePicker
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={1}
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            className="mintinput w-full"
                                            onChange={(e) => field.onChange(e)}
                                            selected={field.value}
                                        />
                                    }
                                    }
                                    rules={{
                                        required: 'this field is required.'
                                    }}
                                />
                                {errors?.auctionEnd && <><span style={{ color: 'red' }}>{errors?.auctionEnd?.message}</span></>}
                            </div>
                        </>
                }

                <div className="text-right">
                    <button className="flex actionbuttons" type="submit" style={{ margin: "0 0 0 auto" }}>
                        List Now
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ViewList;
