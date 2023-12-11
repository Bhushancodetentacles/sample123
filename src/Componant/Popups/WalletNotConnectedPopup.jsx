import React, { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { getItem } from '../../services/localStorageService'
import { ClipboardCheck, Copy } from 'lucide-react'
import { Tooltip } from '@mui/material'

function WalletNotConnectedPopup({ onClose }) {
    const [isCopy,setIsCopy]= useState(false)
    const { address } = useAccount()
    const {walletAddress} = getItem('user')
    useEffect(() => {
        if (address) {
            onClose()
        }
    }, [address])
    function handleCopy(){
        navigator.clipboard.writeText(walletAddress)
        setIsCopy(true)
      }
    return (
        <div>
            <>
                <p className='text-center' >Please note that your wallet is not connected. To proceed, <br /> please connect it using the following wallet address:</p>
                <p className='text-center mt-5 flex gap-2 justify-center lapview' style={{color:"rgb(255 255 255)", fontSize:"18px", cursor:"pointer"}} ><b>{walletAddress}</b> {!isCopy ? <Copy onClick={()=>handleCopy()} />: <ClipboardCheck/>} </p>
      <p className='text-center mt-5 flex gap-2 justify-center mobview' style={{color:"rgb(255 255 255)", fontSize:"18px", cursor:"pointer"}} ><b>{ `${walletAddress ? walletAddress.substring(0,4)+'***'+walletAddress.substring(38,42) : ''}`}</b> {!isCopy ? <Copy onClick={()=>handleCopy()} />: <ClipboardCheck/>} </p>
                <div className='mt-5' >
                <Tooltip title="Connect Wallet" arrow>
                    <ConnectButton chainStatus="icon" showBalance={false} accountStatus={"address"} />
                  </Tooltip>
                </div>
            </>
        </div>
    )
}

export default WalletNotConnectedPopup