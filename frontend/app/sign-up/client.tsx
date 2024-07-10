'use client'
import { useRouter  } from "next/navigation"
import { useState } from "react";
export default function ClientSignUp() {
    const router = useRouter()

    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [reTypePassword,setReTypePassword] = useState("")

    async function submitHandler(e : any){
      e.preventDefault()
      try {
        console.log("Username : ",username,"Email : ",email," Password : ",password, "Retype pass : ",reTypePassword);

        if(password !== reTypePassword){
            return alert("Password and re-enter password are not same")
        }
        
        const response = await fetch("http://localhost:8000/api/sign-up",{
          method : "POST",
          headers : {"Content-Type" : "application/json"},
          body : JSON.stringify({
            username : username,
            email: email,
            password : password
          })
        })

        if(!response){
          throw new Error("Error Occured")
        }
        
        const data = await response.json()
        console.log(data)
        alert("Successfully account is created!")
        router.push('/sign-in')
      } catch (error) {
        console.log(error);
      }
    }


  return (
    <div>
        <h1>Sign Up</h1>
        <form onSubmit={submitHandler}>
        <input type="text" placeholder="Username"  onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder="Email"  onChange={(e) => setEmail(e.target.value)} />
        <input type="text" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="Re-Enter Password" onChange={(e) => setReTypePassword(e.target.value)} />
        <br />
        <input type="radio" />
        <label>Male</label>
        <input type="radio" />
        <label>Female</label>
        <br />
        <button className="" type="submit">Sign Up</button>
      </form>
    </div>
  )
}
