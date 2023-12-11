import React from 'react'
import { MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';
function EmailVarify() {
  return (
    <div>
    <img src="assets/imgs/Logo.png" className='Logo logoheightwidth' alt="" style={{border:"0"}}   />

    <div className="w-full max-w-sm maincard  m-auto  shadow  "  >
      <div className="">
        <h1 className='mb-3'  >Verify your email</h1>
        <p className='text-left mb-3'  >We've sent an email to emailaddress@email.com</p>
        <p className='text-left mb-5' >Please go to your inbox, open the email and click on the link. This will verify your email address and will allow you to come back to finish setting up your account.  </p>
        <p className='text-left mb-5' >The link will expire in 24 hours. </p>
        <p className='text-left' > <a href='#'  ><b>Click here</b> </a> if you did not recieve an email.  </p>

        <Link to="/AccountSetup" className='createsubmitbutton1' ><button type="submit" className="p-0 m-5  mt-5 mb-5"> OK </button></Link>
        <p  className=' text-center my-5'>Important Information about legal, Ts & Cs <br /> Copyrights Etc</p>


      </div>

    </div>

  </div>
  )
}

export default EmailVarify
