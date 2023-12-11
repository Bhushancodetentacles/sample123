import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, MoveRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { post } from '../../services/apiService';
import LoadingButton from '../Button/LoadingButton';

function ResetPassword({ onClose }) {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setisLoading] = useState(false);

    // Handle show and hide password
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Handle form submission
    const onSubmit = async (data) => {
        const { oldPassword, newPassword } = data || {}
        try {
            setisLoading(true)
            const result = await post('updatePassword', { oldPassword, newPassword });
            toast.success(result.data.message);
            setisLoading(false)
            onClose(false)
        } catch (error) {
            setisLoading(false)
            toast.error(error.response?.data?.error);
            console.log(error);
        }
    };

    return (
        <div>
            <div className="w-full max-w-sm m-auto maincard shadow">
                <div className="">
                    <h1 className='mb-5 font-medium' style={{ color: "#98aba9" }}>Reset Password</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-5 text-left">
                            <label htmlFor="oldPassword" className="block mb-2 text-sm font-light text-left inputlabel">Old Password</label>
                            <input
                                type="password"
                                id="oldPassword"
                                className="logininput"
                                autoComplete="off"
                                placeholder="Enter old password"
                                {...register('oldPassword', { required: 'Old password is required' })}
                            />
                            {errors.oldPassword && <span className="text-xs text-red-500">{errors.oldPassword.message}</span>}
                        </div>
                        <div className="mb-5 text-left relative">
                            <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-left inputlabel">New Password</label>
                            <input
                                type={"password"}
                                id="newPassword"
                                className="logininput"
                                autoComplete="off"
                                placeholder='Enter Password'
                                {...register('newPassword', { required: 'New password is required' })}
                            />

                            {errors.newPassword && <span className="text-xs text-red-500">{errors.newPassword.message}</span>}
                        </div>
                        <div className="mb-5 text-left relative">
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-left inputlabel">Confirm Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="confirmPassword"
                                className="logininput"
                                autoComplete="off"
                                placeholder="Confirm Password"
                                {...register('confirmPassword', {
                                    required: 'Confirm password is required',
                                    validate: value => value === watch('newPassword') || 'Passwords do not match',
                                })}
                            />
                            {showPassword ? <Eye className='eyesection' onClick={handleTogglePassword} /> : <EyeOff className='eyesection' onClick={handleTogglePassword} />}
                            {errors.confirmPassword && <span className="text-xs text-red-500">{errors.confirmPassword.message}</span>}
                        </div>
                        <div className='flex gap-3 justify-center mt-5'>
                            <LoadingButton style={{margin:'0'}} isLoading={isLoading} type={'submit'} className="createsubmitbutton p-0 flex items-center gap-2 justify-center m-auto w-full">
                                Submit <MoveRight />
                            </LoadingButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
