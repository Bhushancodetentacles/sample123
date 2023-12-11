
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { get } from '../../services/apiService'
import { useForm } from 'react-hook-form'
import { setItem } from '../../services/localStorageService'

function MFAAuthDialog({ userId }) {
    //handle navigation
    const navigate = useNavigate()
    const { register, formState: { errors }, handleSubmit } = useForm()
    const [qrCode, setQrCode] = useState(null)

    const generateQrCode = async () => {
        try {
            const result = await get(`generateQr?userId=${userId}`)
            setQrCode(result.data.qrCode)
        } catch (error) {
            console.log(error);
        }
    }

    const verify2fA = async (data) => {
        try {
            const result = await get(`verifyMFAToken?secret=${data.token}&userId=${userId}`)
            localStorage.setItem('token', result.data.token)
            setItem('user', result.data.user)
            navigate('/dashboard')
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        generateQrCode()
    }, [])
    return (
        <div>
            <img src="assets/imgs/Logo.png" className='Logo' alt="" style={{ border: "0", width:"250px", padding:"0 0 20px 0" }} />

            <div className="w-full max-w-sm maincard  m-auto  shadow  p-4"  >
                <div className="">
                    <h1 className='mb-3'  >Set up MFA</h1>
                    <p className='text-left text-xs mb-3'  ><b>Install an authenticator appplication on your mobile</b></p>
                    <p className='text-left text-xs mb-5' >Select and download an authenticator (like Google Authenticator) from your application store </p>
                    <p className='text-left text-xs mb-5' ><b>Open your authenticator application</b></p>
                    <p className='text-left text-xs' >Scan the QR code below, and enter the verification code that is displayed in your application.</p>
                    <p className='text-xs' ><b>The verification code expires in 5 minutes. </b></p>
                    <img src={qrCode} alt="" style={{ width: "50%", margin: "10px auto" }} />
                    <form onSubmit={handleSubmit(verify2fA)}>
                        <div className="mb-5">
                            <label htmlFor="2fa" className="block mb-2 text-sm font-light   text-left inputlabel" style={{color:"rgb(231, 240, 233)"}} >Verification Code</label>
                            <input type="text" {...register('token', { required: 'this field is required.' })} id="2fa" className="logininput" autoComplete="off" placeholder="Enter Verification Code" />
                            {
                                errors?.token && <span className='text-xs' style={{ color: 'red' }}>{errors?.token?.message}</span>
                            }
                        </div>
                        <div className='flex gap-2 justify-center mt-5' >
                            <Link to="/" className='createsubmitbutton' ><button type="submit" className="p-0 flex  gap-2 m-auto justify-center">Can't scan ?</button></Link>
                            <button type="submit" className=" createsubmitbutton p-0 m-auto flex gap-2 justify-center w-full">Verify</button>
                        </div>
                    </form>
                    <p className=' text-center text-xs mt-5'>Important Information about legal, Ts & Cs <br /> Copyrights Etc</p>
                </div>
            </div>
        </div>
    )
}

export default MFAAuthDialog
