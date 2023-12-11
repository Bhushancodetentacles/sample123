
import { Plus } from 'lucide-react'
import { useState, useEffect } from "react";
import PopupModals from '../PopupModals'
import Mintproccess from './Mintproccess'


function Mintnow() {
  const [openDialog, setDialogOpen] = useState(false)
//
function handleDialogClose() {
    setDialogOpen(false)
}
  return (
    <>
     {
                openDialog && <PopupModals open={true} onDialogClose={handleDialogClose}>
                    <Mintproccess onClose={handleDialogClose} />
                </PopupModals>
            }
    <div>
      <div>
        <img src="assets/imgs/dummyimage.png" alt="" className='viewimg' style={{ margin: "auto" }} />
      </div>
      <h1 className=' mt-5' >MINT NEW CHIPUCOPRA</h1>
      <h2 className=' mt-4'>SWAG LEVEL - BASIC</h2>
      <p className=' mt-5 text-xs'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo, laboriosam at quas maiores incidunt commodi?</p>
      <div className='flex gap-4 mt-5 justify-center' >
        <p className=' grid items-center' >0.5 QNT </p>
        <button className='flex  mintbutton' onClick={() => setDialogOpen(true)} style={{ margin: '0' }}   >
          <Plus /> Mint Now

        </button>
      </div>

    </div></>
  )
}

export default Mintnow
