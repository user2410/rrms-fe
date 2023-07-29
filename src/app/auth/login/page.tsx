"use client";
import {useForm} from "react-hook-form";
import {useCallback} from "react";

type LoginFormInput = {
    email: string
    password: string
}
export default function Home() {
    const form = useForm<LoginFormInput, any>()
    const {handleSubmit, register} = form
    const onSubmit = useCallback((loginForm: LoginFormInput) => {
        console.log("loginForm", loginForm)
    }, [])
    return <div className="border-gray-100 flex flex-col rounded-lg min-w-[600px] min-h-[360px] bg-blue-100">
        <span className="w-full text-center my-2">Login</span>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-2 items-start justify-center space-y-3">
            <div className="flex flex-row items-center justify-start">
                <span className="min-w-[160px] inline-block">Email</span>
                <input type="text" {...register('email')} className="p-2 min-w-[320px]"/>
            </div>
            <div className="flex flex-row items-center justify-start">
                <span className="min-w-[160px] inline-block">Password</span>
                <input type="password" {...register('password')}   className="p-2 min-w-[320px]"/>
            </div>
            <div className="w-full inline-flex items-center justify-center text-center mt-8">
                <button type="submit" className="border border-gray-300 rounded-lg px-8 py-2
                 hover:bg-blue-500 hover:text-white">Login</button>
            </div>
        </form>
        <div className="w-full flex flex-col items-center justify-start space-y-4 mt-8">
            <button className="w-[200px] inline-flex border-gray-300 border rounded-lg py-2 px-4 text-white bg-blue-500 ">Login with facebook</button>
            <button className="w-[200px] inline-flex border-gray-300 border rounded-lg py-2 px-4 text-white bg-red-600">Login with Google</button>
        </div>
        {/* TODO Chính design thêm các nút Forgot Password và Sign Up cho nó hợp lý - chỉnh lại mầu, kích thước cho hợp lý*/}
    </div>
}