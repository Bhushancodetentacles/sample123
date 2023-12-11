
import { Plus } from 'lucide-react'



function TokenTransfer() {

    return (
        <>

            <div className='text-center'>
                <p className='' >Token ID : SEURYTUEYGFUEYRTUE</p>
                <p className=''>Token Name : Ashwinifhhdfgud</p>
                <p className=''>From : sjdyrfueryueghfueiryuedweui</p>
                <p className=' flex gap-4 justify-center mt-4'>To : <div className="relative">

                    <input type="search" id="default-search" className="block w-full p-4  text-sm searchbox" placeholder="Search" required />
                    <button type="submit" className=" absolute  absolute right-2.5 bottom-4  top-3   "><svg className="w-4 h-4 text-gray-500 dark:text-gray-400 usercolor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg></button>
                </div></p>
                <button className='actionbuttons mt-5' style={{ margin: ' 20px auto' }} >Transfer Now</button>

            </div>
        </>
    )
}

export default TokenTransfer;
