import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, MoveRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { post } from '../../services/apiService';
import PopupModals from '../PopupModals';
import MFAAuthDialog from '../Popups/MFAAuthDialog';
import TwoFADialog from '../Popups/TwoFADialog';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [isMFADialog, setisMFADialog] = useState(false);
  const [isVerifyToken, setisVerifyToken] = useState(false);
  const [userId, setUserId] = useState(null);
  //handle show and hide password
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  //Handle login
  const onSubmit = async (data) => {
    try {
      const result = await post('login', data)
      toast.success(result.data.message)
      setUserId(result.data.userId)
      setisVerifyToken(result.data.is2FAEnabled)
      if(!result.data.is2FAEnabled){
        setisMFADialog(true)
      }
    } catch (error) {
      toast.error(error.response.data.error)
      console.log(error);
    }
  };
  //handle close dialog
  const handleDialogClose = () => {
    setisMFADialog(false)
    setisVerifyToken(false)
  }
  return (
    <div>
      {
         isVerifyToken && 
         <PopupModals open={true} onDialogClose={handleDialogClose}>
         <TwoFADialog userId={userId} onClose={handleDialogClose} />
       </PopupModals>
      }
      {
        isMFADialog && <PopupModals open={true} onDialogClose={handleDialogClose}>
          <MFAAuthDialog userId={userId} onClose={handleDialogClose} />
        </PopupModals>
      }

      
      <img src="/assets/imgs/logo.png" className='Logo logoheightwidth' alt="" style={{ border: "0" }} />

      <div className="w-full max-w-sm m-auto maincard shadow">
        <div className="">
          <h1 className='mb-5 font-medium' style={{ color: "#98aba9" }}>Login</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5 text-left">
              <label htmlFor="email" className="block mb-2 text-sm font-light text-left inputlabel" style={{color:"#98aba9"}} >Username / Email</label>
              <input
                type="text"
                id="username"
                className="logininput"
                autoComplete="off"
                placeholder="Enter Username / Email"
                {...register('username', { required: 'Email/username is required' })}
              />
              {errors.username && <span className="text-xs text-red-500">{errors.username.message}</span>}
            </div>
            <div className="text-left relative">
              <label htmlFor="password" className="block mb-2 text-sm font-medium  text-left inputlabel"style={{color:"#98aba9"}} >Password</label>
              <input type={showPassword ? "text" : "password"} id="password" className="logininput" autoComplete="off" placeholder='Enter Password' {...register('password', { required: 'Password is required' })} />
              {showPassword ? <Eye className='eyesection' onClick={handleTogglePassword} /> : <EyeOff className='eyesection' onClick={handleTogglePassword} />}
              {errors?.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
            </div>
            <p className='inputlabel text-right'  >Forget Password?</p>

            <div className='flex gap-3 justify-center mt-5'>
              <Link to="/Signup" className='createsubmitbutton '>
                <button type="button" className="p-0">CREATE ACCOUNT </button>
              </Link>
              <button type="submit" className="createsubmitbutton p-0 flex items-center gap-2 justify-center m-auto w-full">LOGIN <MoveRight /></button>
            </div>
            <p className='text-center text-xs mt-5' style={{ color: "#98aba9" }} >Important Information about legal, Ts & Cs <br /> Copyrights Etc</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
