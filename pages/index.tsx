import type { NextPage } from 'next'
import  styles from '../styles/Home.module.css'

import axios from 'axios'

//importing react query modules
import { useQuery, useMutation, useQueryClient  } from 'react-query'
import { useState } from 'react'

//creating interface

interface userData {
  id:string,
  name:string,
  email:string
}

const Home: NextPage = () => {

  const queryClient = useQueryClient()
  const [show, setShow] = useState(false)
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [id,setId] = useState('')

  //fetching the data
  const {data : users, isLoading} = useQuery <userData[]>("get-user",fetchUsers)

  //creating the user
  const {mutate:addNewUser} = useMutation((data:any) =>{
    return axios.post("http://localhost:4000/users",data)
  },{
    onSuccess:() => {
      queryClient.invalidateQueries('get-user')
      alert('data created')
    }
  })

  //updating the user
  const {mutate:updateUser} = useMutation((updatedData: any)=>{
    return axios.put(`http://localhost:4000/users/${id}`,updatedData)
  },{
    onMutate: async (updateData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries('get-user');
      // Snapshot the previous value
      const previousUser = queryClient.getQueryData(["get-user"])
      // Optimistically update to the new value
      queryClient.setQueryData(['todos'], updateData)
      //Return a context object with the snapshotted value
      return { previousUser, updateData }
    },
    // If the mutation fails, using the context to fall back to previous data
    onError:(context:any)=>{
      queryClient.setQueryData('get-user', context.previousUser)
    },

    //finally showing the secess message and refetching the data again
    onSettled: () => {
      queryClient.invalidateQueries('get-user')
      alert('Data Edited')
      
    },
  })

  //deleting the user
  const {mutate:deleteUser} = useMutation((id : any)=>{
    return axios.delete(`http://localhost:4000/users/${id}`)
  },{
    onSuccess: () => {
      queryClient.invalidateQueries('get-user')
      alert("Data Deleted SUccessFully!!!")
    }
  })


  if(isLoading){
    return(
      <h1>Data is Loading</h1>
    )
  }

  const addUserHandler = () => {
    addNewUser({
      "name":name,
      "email":email
    })
    clear()
  }

  const getUpdateData = (user : userData)=>{
    setName(user.name)
    setEmail(user.email)
    setId(user.id)
    setShow(true)
  }

  const updateUserHandler = () => {
    updateUser({
      "name":name,
      "email":email
    })
    setShow(false)
    clear()
  }

  const deleteHandler = (user:userData) => {
    deleteUser(user.id)
    clear()
  } 

  const clear = () =>{
    setEmail("")
    setName("")
    setId("")
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
                  <tr className='' key={user.id}>
                    <td className='p-2 px-4 text-[13px]'>{user.id}</td>
                    <td className='p-2 text-[13px]'>{user.name}</td>
                    <td className='p-2 text-[13px]'>{user.email}</td>
                    <td className='p-2'>
                      <div>
                        <button className='bg-blue-400 m-2 p-2 px-4 rounded-md font-semibold text-[12px]' onClick={()=>getUpdateData(user)} >Edit</button>
                        <button className='bg-red-400 m-2 p-2 px-3 rounded-md font-semibold text-[12px]' onClick={()=>deleteHandler(user)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>

        <div className='w-[80%] md:w-[60%] lg:w-[20%]  m-auto bg-slate-200 rounded-lg shadow-md'>
          <div className='p-2 flex flex-col '>
            <input required className='m-2 p-2 rounded-lg' type="text" placeholder='Name' value= {name} onChange={(e)=>setName(e.target.value)} />
            <input required className='m-2 p-2 rounded-lg' type="text" placeholder='Email' value= {email} onChange={(e)=>setEmail(e.target.value)} />

            {
              show
              ?
              <button className='bg-blue-300 m-1 p-2 text-[12px] font-semibold rounded-lg text-slate-600' onClick ={updateUserHandler} >Update User</button>
              :
              <button className='bg-green-300 m-1 p-2 text-[12px] font-semibold rounded-lg text-slate-600' onClick={ addUserHandler} >Add User</button>
            }
            
          </div>

        </div>

    </>
  )
}

export default Home

const fetchUsers = () => {
  const responce = axios.get("http://localhost:4000/users").then((res)=>res.data)
  return responce
}