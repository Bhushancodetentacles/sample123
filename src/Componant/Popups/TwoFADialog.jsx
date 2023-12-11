
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { get } from '../../services/apiService'
import { useForm } from 'react-hook-form'
import { setItem } from '../../services/localStorageService'

function TwoFADialog({ userId }) {
    //handle navigation
    const navigate = useNavigate()
    const { register, formState: { errors }, handleSubmit } = useForm()

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


    return (
        <div>
            <img src="assets/imgs/Logo.png" className='Logo' alt="" style={{ border: "0", width:"250px", padding:"0 0 20px 0" }} />

            <div className="w-full max-w-sm maincard  m-auto  shadow  p-4"  >
                <div className="">
                   
                    <form onSubmit={handleSubmit(verify2fA)}>
                        <div className="mb-5">
                            <label htmlFor="2fa" className="block mb-2 text-sm font-light   text-left inputlabel" style={{color:"rgb(231, 240, 233)"}} >Verification Code</label>
                            <input type="text" {...register('token', { required: 'this field is required.' })} id="2fa" className="logininput" autoComplete="off" placeholder="Enter Verification Code" />
                            {
                                errors?.token && <span className='text-xs' style={{ color: 'red' }}>{errors?.token?.message}</span>
                            }
                        </div>
                        <div className='flex gap-2 justify-center mt-5' >
                            <button type="submit" className=" createsubmitbutton p-0 m-auto flex gap-2 justify-center w-full">Verify</button>
                        </div>
                    </form>
                    <p className=' text-center text-xs mt-5'>Important Information about legal, Ts & Cs <br /> Copyrights Etc</p>
                </div>
            </div>
        </div>
    )
}

export default TwoFADialog
