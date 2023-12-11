import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MoveRight, MoveLeft, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../../services/apiService';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import PopupModals from "../PopupModals"
import MFAAuthDialog from "../Popups/MFAAuthDialog"
function Signup() {
  //hanlde form
  const { register, control, handleSubmit, formState: { errors }, clearErrors, setError } = useForm();
  //handle navigation
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);
  const [isMFADialog, setisMFADialog] = useState(false);
  const [userId, setUserId] = useState(null);
  //handle show and hide password
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  //handle submission
  const onSubmit = async (data) => {
    try {
      const result = await post('register', data)
      toast.success(result.data.message)
      setUserId(result.data.userId)
      setisMFADialog(true)
    } catch (error) {
      setisMFADialog(false)
      console.log(error);
    }
  };

  //check email is exist
  const checkEmailExist = async (email) => {
    if (email.length == 0) return setError('email', { message: 'email is required.' })
    try {
      const result = await post('checkEmail', { email: email })
      if (result.data.isExist) {
        setError('email', { message: 'email already taken.' });
      } else {
        clearErrors('email')
      }
    } catch (error) {
      console.log(error);
    }
  }

  //check email is exist
  const checkUserNameExist = async (username) => {
    if (username.length == 0) return setError('username', { message: 'username is required.' })
    try {
      const result = await post('checkUsername', { username })
      if (result.data.isExist) {
        setError('username', { message: 'username already taken.' });
      } else {
        clearErrors('username')
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleDialogClose() {
    setisMFADialog(false)
  }

  return (
    <div>

      {
        isMFADialog && <PopupModals open={true} onDialogClose={handleDialogClose}>
          <MFAAuthDialog userId={userId} onClose={handleDialogClose} />
        </PopupModals>
      }

      <img src="/assets/imgs/logo.png" className='Logo logoheightwidth' alt="" style={{ border: "0" }} />

      <div className="w-full max-w-sm  m-auto  maincard  shadow  "  >
        <div className="">
          <h1 className='mb-5 font-medium' style={{ color: "#98aba9" }} >Sign Up</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5 text-left">
              <label htmlFor="firstName" className="block mb-2 text-sm font-light  text-left inputlabel" style={{ color: "#98aba9" }}>First Name</label>
              <input type="text" id="firstName" className="logininput" autoComplete="off" placeholder="Enter full legal first name" {...register('firstName', { required: 'First Name is required' })} />
              {errors?.firstName && <span className="text-xs  text-red-500">{errors?.firstName?.message}</span>}
            </div>
            <div className="mb-5 text-left">
              <label htmlFor="surname" className="block mb-2 text-sm font-light  text-left inputlabel" style={{ color: "#98aba9" }} >Surname</label>
              <input type="text" id="surname" className="logininput" autoComplete="off" placeholder="Enter full legal surname" {...register('surname', { required: 'Surname is required' })} />
              {errors?.surname && <span className="text-xs text-red-500">{errors?.surname?.message}</span>}
            </div>
            <div className="mb-5 text-left">
              <label htmlFor="email" className="block mb-2 text-sm font-light  text-left inputlabel" style={{ color: "#98aba9" }}>Email Address</label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => {
                  return <input
                    {...field}
                    type="text"
                    id="email"
                    className="logininput"
                    autoComplete="off"
                    placeholder="Enter Email Address"
                    onBlur={(e) => field.onBlur(checkEmailExist(e.target.value))}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                }}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Invalid email address'
                  }
                }}
              />
              {errors?.email && <span className="text-xs text-red-500">{errors?.email?.message}</span>}
            </div>
            <div className="mb-5 text-left">
              <label htmlFor="username" className="block mb-2 text-sm font-light  text-left inputlabel" style={{ color: "#98aba9" }} >Username</label>
              <Controller
                control={control}
                name="username"
                render={({ field }) => {
                  return <input
                    {...field}
                    type="text"
                    id="username"
                    className="logininput"
                    autoComplete="off"
                    placeholder="Enter Username (Display Name)"
                    onBlur={(e) => field.onBlur(checkUserNameExist(e.target.value))}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                }}
                rules={{
                  required: 'username is required.',
                }}
              />
              {errors?.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
            </div>
            <div className="mb-5 text-left">
              <label htmlFor="username" className="block mb-2 text-sm font-light  text-left inputlabel" style={{ color: "#98aba9" }}>Wallet Address</label>
              <Controller
                control={control}
                name="walletAddress"
                render={({ field, }) => {
                  return <input
                    {...field}
                    type="text"
                    id="walletAddress"
                    className="logininput"
                    autoComplete="off"
                    placeholder="Enter walletAddress"
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                }}
                rules={{
                  required: 'wallet address is required.',
                  validate: (item) => {
                    return ethers.utils.isAddress(item) || 'invalid wallet address'
                  }
                }}
              />
              {errors?.walletAddress && <span className="text-xs text-red-500">{errors.walletAddress.message}</span>}
            </div>
            <div className="mb-5 text-left relative">
              <label htmlFor="password" className="block mb-2 text-sm font-medium  text-left inputlabel" style={{ color: "#98aba9" }}>Password</label>
              <input type={showPassword ? "text" : "password"} id="password" className="logininput" autoComplete="off" placeholder='Enter Password' {...register('password', { required: 'Password is required' })} />
              {showPassword ? <EyeOff className='eyesection' onClick={handleTogglePassword} /> : <Eye className='eyesection' onClick={handleTogglePassword} />}
              {errors?.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
            </div>

            <div className='flex gap-2 justify-center mt-5' >
              <Link to="/" className='createsubmitbutton' ><button type="button" className="p-0 flex gap-2 m-auto justify-center items-center"><MoveLeft /> BACK </button></Link>
              <button type="submit" className={`createsubmitbutton flex gap-2 justify-center`} >CREATE <MoveRight /></button>
            </div>
            <p className=' text-center text-xs mt-5' style={{ color: "#98aba9" }}>Important Information about legal, Ts & Cs <br /> Copyrights Etc</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
