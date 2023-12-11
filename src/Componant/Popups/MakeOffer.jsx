
import PopupModals from '../PopupModals';
import SubmitModal from './SubmitModal';
import { useState } from 'react';
import { formatUnixFormatDate } from '../../utils/formatUnixFormatDate';
import useContractService from '../../hooks/useContractService';
import TransactionConfirmation from './TransactionConfirmation';
import { useForm } from 'react-hook-form';
import {  Clock12, User } from 'lucide-react';
import WrongWalletAddressDialog from './WrongWalletAddressDialog';
import WalletNotConnectedPopup from './WalletNotConnectedPopup';
const CHAIN_ID = parseInt(import.meta.env.VITE_APP_CHAIN_ID)
const waitingTime = parseInt(import.meta.env.VITE_APP_WAITING_TIME)
function MakeOffer({ data, onClose }) {
    const { handleMetamaskError, makeOfferForFixedSaleNFT, makeOfferForNFT, tokenApprovalForMarketPlaceContract,isWalletConnected,isWrongWalletConnected } = useContractService()
    const { formState: { errors }, register, handleSubmit } = useForm()
    const [isTransaction, setIsTransaction] = useState(false)
    const [transactionMessage, setTransactionMessage] = useState("Please Wait...");
    const [isAddressWrong, setIsAddressWrong] = useState(false)
    const [hasWalletNotConnected, setHasWalletNotConnected] = useState(false)
    //handle close dialog
    function handleDialogClose() {
        setIsTransaction(false)
    }

    function onSubmit(item) {
        if (data.isType == 1) {
            makeOfferForFixedSaleNFTFn(item)
        } else {
            makeOfferForNonListed(item)
        }
    }


    const makeOfferForFixedSaleNFTFn = async (items) => {
        if (isWrongWalletConnected()) return setIsAddressWrong(true)
        if (!await isWalletConnected(CHAIN_ID)) return setHasWalletNotConnected(true)
        const { price } = items
        try {
            setIsTransaction(true)
            setTransactionMessage('Waiting For Approval...')
            const approval = await tokenApprovalForMarketPlaceContract(import.meta.env.VITE_APP_NFT_MARKET_PLACE_CONTRACT_ADDRESS, price)
            if (approval) {
                await approval.wait()
            }
            setTransactionMessage('Waiting For Transaction...')
            const result = await makeOfferForFixedSaleNFT(data.indexId, price)
            setTransactionMessage('Validating Transaction On Blockchain.')
            await result.wait(waitingTime)
            setIsTransaction(false)
            onClose(true)
        } catch (error) {
            setIsTransaction(false)
            handleMetamaskError(error)
            console.log(error);
        }
    }
    const makeOfferForNonListed = async (items) => {
        const { price } = items
        if (isWrongWalletConnected()) return setIsAddressWrong(true)
        if (!await isWalletConnected(CHAIN_ID)) return setHasWalletNotConnected(true)
        try {
            setIsTransaction(true)
            setTransactionMessage('Waiting For Approval...')
            const approval = await tokenApprovalForMarketPlaceContract(import.meta.env.VITE_APP_NFT_MARKET_PLACE_CONTRACT_ADDRESS, price)
            if (approval) {
                await approval.wait()
            }
            setTransactionMessage('Waiting For Transaction...')
            const result = await makeOfferForNFT(data.nftContract, data.tokenID, price)
            setTransactionMessage('Validating Transaction On Blockchain.')
            await result.wait(waitingTime)
            setIsTransaction(false)
            onClose(true)
        } catch (error) {
            setIsTransaction(false)
            handleMetamaskError(error)
            console.log(error);
        }
    }
        //HANDLE CLOSE DIALOG
        function handleDialogCloseForWrongWallet() {
            setIsAddressWrong(false)
            setHasWalletNotConnected(false)
        }
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
                <div>
                    <div>
                        <img src={data.nftImage} alt="" className='viewimg' style={{ margin: "auto" }} />
                    </div>
                    <div className='pt-5' >
                        <h2 className='text-left font-bold text-lg mb-5' >
                            {data.name}
                        </h2>
                        <div>
                            <div className="flex justify-between mb-2" >

                                <p className=' font-bold' >Minted</p>
                                <p className='flex gap-2'><Clock12 width={"15px"} style={{ color: "rgba(34, 47, 27, 0.54)" }} />{formatUnixFormatDate(data.mintedCreatedDate)}</p>
                            </div>
                            {/* <div className="flex justify-between" >

                                <p className='' >Traits</p>
                                <p className=''>Fearsome, Clawai</p>
                            </div> */}
                            <div className="flex justify-between mb-2" >

                                <p className=' font-bold' >Owned By</p>
                                <p className='flex gap-2'> <User width={"15px"} style={{ color: "rgba(34, 47, 27, 0.54)" }} />{(data.owner.id?.toLowerCase() == import.meta.env.VITE_APP_NFT_MARKET_PLACE_CONTRACT_ADDRESS?.toLowerCase()) ? 'MarketPlace' : data.username}</p>
                            </div>
                            {/* <div className="flex justify-between" >

                                <p className='' >Rarity </p>
                                <p className=' '>Common</p>
                            </div> */}
                            <div className="flex justify-between mb-2" >
                                <p className=' font-bold' >Value </p>
                                <p className=' flex gap-2'> {isNaN(parseInt(data.marketPrice) / 1e18) ? '--' : parseInt(data.marketPrice) / 1e18} QNT</p>
                            </div>

                        </div>


                        <div className='' >
                            <form onSubmit={handleSubmit(onSubmit)}>

                                <div className='flex mb-5 justify-between' >
                                    <label htmlFor="" className=''><b className='font-bold' >Enter Price for Offer</b></label>
                                    <div className='flex' >
                                        <div>
                                            <input {...register('price', {
                                                required: 'this field is required.', pattern: {
                                                    value: /^-?\d+(\.\d+)?$/,
                                                    message: 'invalid number'
                                                }
                                            })} type="text" className="logininput valueinput" autoComplete="off" placeholder='0.0000' />
                                            {errors.price && <><p className="text-red-500 text-xs">{errors.price.message}</p></>}
                                        </div>
                                        <p className=' items-center grid p-2' >QNT</p>
                                    </div>
                                </div>

                                <div className='text-right' >
                                    <button type="submit" className='actionbuttons' style={{ margin: 'auto' }} >Make Offer</button>
                                </div>
                            </form>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default MakeOffer;
