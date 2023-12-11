import React, { useEffect, useState } from "react";
import { useForm ,Controller} from "react-hook-form";
import Header from "../Componant/Common/Header";
import { get, post } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import PopupModals from "../Componant/PopupModals"
import ResetPassword from "../Componant/Popups/ResetPassword";
import { toast } from "react-toastify";
import LoadingButton from "../Componant/Button/LoadingButton";
function Profile() {
    const navigate = useNavigate()
    const { register, control, handleSubmit, formState: { errors },setValue, clearErrors, setError } = useForm();

    const [intranaId, setIntranaId] = useState(null)
    const [isResetPassword, setIsResetPassword] = useState(false)
    const [isLoading, setisLoading] = useState(false)
    //get profile data
    const getProfileInfo = async () => {
        try {
            const result = await get('profileInfo')
            const { firstName, intranaId, surname, email, walletAddress, username } = result.data
            setValue('firstName', firstName)
            setValue('surname', surname)
            setValue('email', email)
            setValue('walletAddress', walletAddress)
            setValue('intranaId', intranaId)
            setValue('username', username)
            setIntranaId(intranaId)
        } catch (error) {
            console.log(error);
        }
    }

    //update profile 
    const profileUpdate = async (data) => {
        const { firstName, surname, username } = data || {}
        try {
            setisLoading(true)
            const result = await post('profileUpdate', { firstName, surname, username })
            toast.success(result.data.message)
            setisLoading(false)
        } catch (error) {
            setisLoading(false)
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


    //handle dialog close reset password
    function handleDialogCloseResetPass() {
        setIsResetPassword(false)
    }
    //handle logout
    function handleLogout() {
        const keysToRemove = ['user', 'token'];

        keysToRemove.forEach((key) => {
            localStorage.removeItem(key);
        });
        navigate('/')
    }
    useEffect(() => {
        getProfileInfo()
    }, [])
    return (
        <>
            {
                isResetPassword &&
                <PopupModals open={true} onDialogClose={handleDialogCloseResetPass}>
                    <ResetPassword onClose={handleDialogCloseResetPass} />
                </PopupModals>
            }
            <Header />
            <div className="bg-pattern bg-center bg-repeat max-w-screen-xl mx-auto flex flex-col gap-3 w-full margintop">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2  mt-5 p-5">
                    <h1 className="col-span-1 text-left mb-5">Account Preview</h1>
                    <h1 className="col-span-1 text-right truncate">ID : {intranaId}</h1>
                </div>
                <form className="w-full p-5" onSubmit={handleSubmit(profileUpdate)}>
                    {/* Forename Input */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
                        <div className="col-span-1">
                            <div className="md:flex md:items-center mb-1">
                                <div className="">
                                    <label
                                        className="block text-xs accountlabel md:text-right mb-1 md:mb-0 pr-4"
                                        htmlFor="forename"
                                    >
                                        Forename
                                    </label>
                                </div>
                                <div className="w-full">
                                    <input
                                        {...register("firstName", { required: "Forename is required" })}
                                        className="bg-gray-200 accountinput appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                        type="text"
                                        placeholder="Janathon"
                                    />
                                    {errors.forename && <p className="text-xs text-left text-red-500">{errors.forename.message}</p>}
                                </div>
                            </div>
                        </div>
                        {/* Surname Input */}
                        <div className="col-span-1">
                            <div className="md:flex md:items-center mb-1">
                                <div className="">
                                    <label
                                        className="block text-xs accountlabel md:text-right mb-1 md:mb-0 pr-4"
                                        htmlFor="surname"
                                    >
                                        Surname
                                    </label>
                                </div>
                                <div className="w-full">
                                    <input
                                        {...register("surname", { required: "Surname is required" })}
                                        className="bg-gray-200 accountinput appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                        type="text"
                                        placeholder="Example"
                                    />
                                    {errors.surname && <p className="text-xs text-left text-red-500">{errors.surname.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="md:flex md:items-center mb-1">
                                <div className="">
                                    <label
                                        className="block text-xs accountlabel md:text-right mb-1 md:mb-0 pr-4"
                                        htmlFor="username"
                                    >
                                        Username
                                    </label>
                                </div>
                                <div className="w-full">
                                   
                                    <Controller
                                        control={control}
                                        name="username"
                                        render={({ field }) => {
                                            return <input
                                                {...field}
                                                type="text"
                                                id="username"
                                                className="bg-gray-200 accountinput appearance-none border-2  rounded w-full py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
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
                                    {errors?.username && <span className="text-xs text-left text-red-500">{errors?.username?.message}</span>}
                                </div>
                            </div>
                        </div>
                        {/* Email Input */}
                        <div className="col-span-1">
                            <div className="md:flex md:items-center justify-between mb-3">
                                <div className="">
                                    <label
                                        className="block text-xs accountlabel md:text-right mb-1 md:mb-0 pr-4"
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>
                                </div>
                                <div className="w-full">
                                    <input
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /\S+@\S+\.\S+/,
                                                message: "Invalid email format",
                                            },
                                        })}
                                        disabled={true}
                                        className="bg-gray-200 accountinput appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                        type="text"
                                        placeholder="Example@gmail.com"
                                    />
                                    {errors.email && <p className="text-xs text-left text-red-500">{errors.email.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="md:flex md:items-center justify-between mb-6">
                                <div>
                                    <label
                                        className="block text-xs accountlabel md:text-right mb-1 md:mb-0 pr-4"
                                        htmlFor="intranaId"

                                    >
                                        User ID
                                    </label>
                                </div>
                                <div className="w-full">
                                    <input
                                        {...register("intranaId", { required: "User ID is required" })}
                                        className="bg-gray-200 accountinput appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                        type="text"
                                        placeholder="Janathon"
                                        disabled={true}
                                    />
                                    {errors.intranaId && <p className="text-xs text-left text-red-500">{errors.intranaId.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="md:flex  justify-between ">
                                <div>
                                    <label
                                        className="block text-xs accountlabel md:text-right mb-1 md:mb-0 pr-4"
                                        htmlFor="wallets"
                                    >
                                        Associated Wallet(s)
                                    </label>
                                </div>
                                <div className="w-full">
                                    <input
                                        {...register("walletAddress", { required: "wallet address is required" })}
                                        className="bg-gray-200 accountinput appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                        type="text"
                                        placeholder="349dhgyt5yue5yi45"
                                        disabled
                                    />
                                    <p className="formspan text-right">XinFin</p>
                                    {errors.walletAddress && <p className="text-xs text-left text-red-500">{errors.walletAddress.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="md:flex md:items-center justify-between mb-6">
                                <div>
                                    <label
                                        className="block text-xs accountlabel md:text-right mb-1 md:mb-0 pr-4"
                                        htmlFor="accountStatus"
                                    >
                                        Account Status
                                    </label>
                                </div>
                                <div className="w-full">
                                    <select
                                        // {...register("accountStatus", { required: "Select an option" })}
                                        id="accountStatus"
                                        className="logininput py-0 px-2"
                                    >
                                        <option value="">Select a country</option>
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="FR">France</option>
                                        <option value="DE">Germany</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-5">
                        <button
                            className="makeofferbutton"
                            style={{ margin: "0" }}
                            type="button"
                            onClick={() => setIsResetPassword(true)}
                        >
                            Reset Password
                        </button>
                        <LoadingButton style={{ margin: "0" }} isLoading={isLoading} type={'submit'} className="makeofferbutton">
                            save changes
                        </LoadingButton>
                    </div>
                    <div className="text-right mt-5">
                        <button type="submit" onClick={() => handleLogout()} className="p-0 m-5 createsubmitbutton1" >
                            Logout
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Profile;
