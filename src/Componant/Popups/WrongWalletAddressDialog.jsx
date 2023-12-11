import React, { useState } from 'react'
import { getItem } from '../../services/localStorageService'
import { ClipboardCheck, Copy } from 'lucide-react'

function WrongWalletAddressDialog({onClose}) {
  const [isCopy,setIsCopy]= useState(false)
  const { walletAddress } = getItem('user')
  function handleCopy(){
    navigator.clipboard.writeText(walletAddress)
    setIsCopy(true)
  }
  return (
    <>
      <p className='text-center' >
      You are currently connected with the incorrect wallet address. <br /> Please connect with the following address:
      </p>
      <p className='text-center mt-5 flex gap-2 justify-center lapview' style={{color:"rgb(255 255 255)", fontSize:"18px", cursor:"pointer"}} ><b>{walletAddress}</b> {!isCopy ? <Copy onClick={()=>handleCopy()} />: <ClipboardCheck/>} </p>
      <p className='text-center mt-5 flex gap-2 justify-center mobview' style={{color:"rgb(255 255 255)", fontSize:"18px", cursor:"pointer"}} ><b>{ `${walletAddress ? walletAddress.substring(0,4)+'***'+walletAddress.substring(38,42) : ''}`}</b> {!isCopy ? <Copy onClick={()=>handleCopy()} />: <ClipboardCheck/>} </p>
      <div className='text-center' >
      <button className='createsubmitbutton1' style={{cursor:'pointer'}} onClick={onClose}>ok</button>
      </div>
    </>
  )
}

export default WrongWalletAddressDialog