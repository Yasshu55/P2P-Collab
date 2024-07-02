'use client'
import { useRouter  } from "next/navigation"

export default function ClientSignIn() {
    const router = useRouter()
  return (
    <div>
        <button onClick={() => router.push('/createRoom')}>Submit</button>
    </div>
  )
}
