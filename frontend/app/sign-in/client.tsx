'use client'
import { useRouter  } from "next/navigation"
import { useState } from "react";

export default function ClientSignIn() {
    const router = useRouter()
    const [email,setEmail] = useState("user123@gmail.com")
    const [password,setPassword] = useState("user123")

    async function submitHandler(e : any){
      e.preventDefault()
      try {
        console.log("Email : ",email," Password : ",password);
        
        const response = await fetch("http://localhost:8000/sign-in",{
          method : "POST",
          headers : {"Content-Type" : "application/json"},
          body : JSON.stringify({email: email,password : password})
        })

        if(!response){
          throw new Error("Error Occured")
        }

        const data = await response.json()
        console.log(data)
      } catch (error) {
        console.log(error);
        
      }
    }


  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={submitHandler}>
        <input type="text" placeholder="Email" defaultValue="user123@gmail.com" onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Password" defaultValue="user123" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}
