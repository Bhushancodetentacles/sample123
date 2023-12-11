import React from 'react'

function ActivityStatus() {
  return (
    <div>
        <h1 className=' mb-5' >Activity Details</h1>
      <div className='text-left'>
        <div className="grid grid-cols-2">
            <div className="col-span-1">
                <p className=' mb-3' >Type : New Mint - Basic</p>
                <p className=' mb-3'>from : Collection</p>
                <p className=' mb-3'>To : User12345</p>
                <p className=' mb-3'>Amout Paid : 0.5 QNT</p>
                <p className=' mb-3'>Timestamp : 06/06/2023 11:23:04</p>
                <p className=' mb-3'>Status : Transfer Successful</p>
            </div>
            <div className="col-span-1">
                <p className=' mb-3' >Level : Basic Swag</p>
                <p className=' mb-3'>Loken ID : ruyrfg...huferbf </p>
                <p className=' mb-3' >Chain Transcation Id : uf85...3478</p>
                <p className=' mb-3'>Currency Paid : USD</p>
                <p className=' mb-3'>USD Value at time of Payment : $112.23</p>
                <button type="submit" className="p-0 m-5  mt-5 mb-5 createsubmitbutton1" style={{width:"100%"}}> Close </button>
            </div>
        </div>
                

            </div>
    </div>
  )
}

export default ActivityStatus
