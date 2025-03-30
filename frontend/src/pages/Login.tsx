import { Link, useNavigate } from "react-router-dom"
import { LabelInput } from "../components/Inputs"
import { Button } from "../components/ui/button"
import { getFormEntries } from "../lib/utils"
import { login } from "../features/auth/action"
import { useState } from "react"
import { Alert, AlertDescription } from "../components/ui/alert"
import { AlertCircle, X } from "lucide-react"
function Login() {
    const [btn, setBtn] = useState("sign in");
    const [ErrMsg, setErrMsg] = useState("");
    const [alert, setAlert] = useState("hidden");
    const navigate = useNavigate();
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
                    ReserviHub
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={async (e) => {
                            e.preventDefault()
                            const data = new FormData(e.currentTarget);
                            setBtn("Loading...")
                            const entries = getFormEntries(data) as Record<string, string>;
                            const res = await login(entries);
                            if (res.success) {
                                navigate("/");
                            } else {
                                setErrMsg(res.message);
                                setAlert("flex");
                                setBtn("try again");
                            }
                        }}>
                            <LabelInput id="email" labelText='email' type='email' autoComplete='email' placeHolder="example@gmail.com" />
                            <LabelInput id='password' labelText='password' type='password' autoComplete='current-password' placeHolder="******" />

                            <Button type="submit" variant={"default"} className="w-full bg-purple-600 hover:bg-purple-900">{btn}</Button>


                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Register</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <Alert className={`absolute z-10 bottom-0 m-4 w-fit right-0 ${alert} gap-4`} variant={"destructive"}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    {ErrMsg}
                </AlertDescription>
                <X className='cursor-pointer' onClick={() => {
                    setAlert("hidden")
                }} />
            </Alert>
        </section>
    )
}

export default Login
