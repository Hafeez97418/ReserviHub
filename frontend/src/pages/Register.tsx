import { Link } from 'react-router-dom'
import { LabelInput } from '../components/Inputs'
import image from "../assets/register-main.jpg";
import { verifyEmail } from '../features/auth/action';
import OTP_Form from '../components/OTP_Form';
import { useDispatch } from 'react-redux';
import { toggleOTPForm } from '../features/ui/uiSlice';
import { useState } from 'react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AlertCircle, X } from 'lucide-react';

function Register() {
    const dispatch = useDispatch();
    const [btnText, setBtnText] = useState("sign up");
    const [alert, setAlert] = useState("hidden");
    const [alertMsg, setAlertMsg] = useState("");
    return (
        <section className="bg-gray-50 dark:bg-gray-900 h-full">
            <div className="flex lg:py-0 flex-col lg:flex-row h-screen ">
                <div className='lg:order-2 bg-gray-200 w-full h-full bg-no-repeat bg-center bg-cover lg:flex items-center justify-center bg-blend-darken flex-col order-1 ' style={{
                    backgroundImage: `url("${image}")`,
                    backgroundColor: "#0000008f"
                }}>
                    <h1 className='font-bold text-white lg:text-6xl text-4xl text-center'>welcome to reservihub</h1>
                    <p className='text-white text-lg font-semibold text-center'>Effortless Reservations, Seamless Experiences</p>
                </div>
                <div className={` lg:bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 py-4 px-8 flex items-center justify-center w-full lg:block mx-auto order-2 lg:order-1 h-screen overflow-y-auto`}>
                    <div className='w-full'>
                        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white  my-2">
                            <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                            ReserviHub
                        </a>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            create new account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={async (e) => {
                            setBtnText("Loading...");
                            const res = await verifyEmail(e);

                            if (res.success) {
                                setBtnText("sign up");
                                dispatch(toggleOTPForm());
                                return;
                            }
                            setAlert("flex");
                            setAlertMsg(res.message);
                            setBtnText("try again");
                        }}>
                            <LabelInput id="name" labelText='full name' type='text' autoComplete='username' />
                            <LabelInput id="email" labelText='email' type='email' autoComplete='email' placeHolder='example@gmail.com' />
                            <LabelInput id='phoneNumber' labelText='phone number' type='number' placeHolder='XXXXXXXXXX' />
                            <LabelInput id='password' labelText='password' type='password' autoComplete='current-password' placeHolder='******' />
                            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-purple-600 text-white">{btnText}</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                already have an account? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500" >Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <Alert className={`absolute z-10 bottom-0 m-4 w-fit right-0 ${alert}`} variant={"destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {alertMsg}
                </AlertDescription>
                <X className='cursor-pointer' onClick={() => {
                    setAlert("hidden")
                }} />
            </Alert>
            <OTP_Form />
        </section>
    )
}

export default Register
