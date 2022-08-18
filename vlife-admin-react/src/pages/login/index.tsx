import React, { useEffect, useRef } from 'react'
import { useAuth } from "@src/context/auth-context";
import './login.css'
import {useForm} from '@src/hooks/useForm'
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@src/types/user';


const Index: React.FC = () => {
    const {user,login,error} = useAuth();
    const navigate = useNavigate()
    const {values,errors,setFieldValue } = useForm<AuthForm>({username:'admin',password:'123456'},null);
    useEffect(()=>{
        if(user&&user.id){
            navigate("/")
        }
    },[user])

    //async 意义
    const handelSubmit = async () => {
      await login(values);
    };
    
    // const handleSubmit = async () => {
    // try {
    //     await run(login(values));
    // } catch (e) {
    //     onError(e);
    // }
    // };
    

	return (
  <div className="body-bg min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0" >
      <div className="max-w-lg mx-auto pt-2">
          <h1 className="text-5xl font-bold text-white text-center">VLIFE-ADMIN</h1>
      </div>
      <main className="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
        <section>
            <h3 className="font-bold text-2xl">欢迎你体验VLIFE平台快速开发能力</h3>
            <p className="text-gray-600 pt-2">请输入账号信息.</p>
        </section>

      
        <section className="mt-10">
            <div className="flex flex-col" >
                    <p className="text-red-600 pt-2 text-center ">{error}</p>
                    <div className="mb-6 pt-3 rounded bg-gray-200">
                        <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="email">账号</label>
                        <input type="text" id="username" 
                        value={values.username||''} onChange={(evt) => setFieldValue("username", evt.target.value)}
                        className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3" />
                    </div>
                    <div className="mb-6 pt-3 rounded bg-gray-200">
                        <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="password">密码</label>
                        <input type="password"   id="password"
                        value={values.password||''} onChange={(evt) => setFieldValue("password", evt.target.value)}
                        className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-600 transition duration-500 px-3 pb-3" />
                    </div>
                    <div className="flex justify-end">
                        <a href="#" className="text-sm text-purple-600 hover:text-purple-700 hover:underline mb-6">忘记密码?</a>
                    </div>
                    {/* <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"  onClick={()=>ll}>登陆1</button> */}
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200" onClick={handelSubmit} >登陆</button>
                </div>
        </section>
    </main>

     {/* <div className="max-w-lg mx-auto text-center mt-12 mb-6">
        <p className="text-white">没有账号? <a href="#" className="font-bold hover:underline">Sign up</a>.</p>
    </div> */}

    <div className="max-w-lg mx-auto flex justify-center text-white">
        {/* <a href="#" className="hover:underline">联系我们</a>
        <span className="mx-3">•</span> */}
        <a href="#" className="hover:underline">鄂ICP备2022008507号</a>
    </div>
  </div>)
}

export default Index
