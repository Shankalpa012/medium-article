import type { NextPage } from 'next'
import  styles from '../styles/Home.module.css'

import axios from 'axios'

//importing react query modules
import { useQuery } from 'react-query'

//creating interface

interface userData {
  id:number
  name:string,
  email:string
}

const Home: NextPage = () => {
  const {data : users, isLoading} = useQuery <userData[]>("get-user",fetchUsers)
  if(isLoading){
    return(
      <h1>Data is Loading</h1>
    )
  }

  return (
    <>
      <h1 className='text-[21px] text-center m-2'>CURD with React Query</h1>

        <table className=' border-collapse  shadow-md rounded-lg w-[100%] sm:w-[80%] lg:w-[60%] mx-auto my-[20px]'>
          <thead className='bg-slate-100 rounded-lg '>
            <tr className='text-[15px]  text-left font-light text-slate-600'>
              <th className='p-3 font-md'>Name</th>
              <th className='p-3 font-md'>Sn</th>
              <th className='p-3 font-md'>Email</th>
              <th className='p-3 font-md'>Actions</th>
            </tr>
          </thead>

          <tbody className='bg-grey-200'>
            {
              users?.map((user)=>{
                return(
                  <tr className=''>
                    <td className='p-2 px-4 text-[13px]'>{user.id}</td>
                    <td className='p-2 text-[13px]'>{user.name}</td>
                    <td className='p-2 text-[13px]'>{user.email}</td>
                    <td className='p-2'>
                      <div>
                        <button className='bg-red-400 m-2 p-2 px-3 rounded-md font-semibold text-[12px]'>Delete</button>
                        <button className='bg-blue-400 m-2 p-2 px-4 rounded-md font-semibold text-[12px]'>Edit</button>
                      </div>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

    </>
  )
}

export default Home

const fetchUsers = () => {
  const responce = axios.get("http://localhost:4000/users").then((res)=>res.data)
  return responce
}