'use client'
import { useRouter  } from "next/navigation"
import { useState } from "react";

export default function ClientSignIn() {
    const router = useRouter()
    const [email,setEmail] = useState("yash@gmail.com")
    const [password,setPassword] = useState("1234")

    async function submitHandler(e : any){
      e.preventDefault()
      try {
        console.log("Email : ",email," Password : ",password);
        
        const response = await fetch("http://localhost:8000/api/sign-in",{
          method : "POST",
          headers : {"Content-Type" : "application/json"},
          body : JSON.stringify({email: email,password : password}),
          credentials: 'include',
        },)

        if(!response){
          throw new Error("Error Occured")
        }

        const data = await response.json()
        console.log(data)
        router.push("/createRoom")
      } catch (error) {
        console.log(error);
      }
    }


  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={submitHandler}>
        <input type="text" placeholder="Email" defaultValue="yash@gmail.com" onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Password" defaultValue="1234" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}
