'use client'

import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Home() {
    // redirect("/dashboard")
    const router = useRouter()

    useEffect(() => {
        router.push("/dashboard")
    }, [])


}
