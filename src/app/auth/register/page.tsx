import RegisterForm from "@/components/auth/RegisterForm"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import React from "react"

async function page() {
    const session = await getServerSession(authOptions)
    if (session) {
        redirect("/")
    }
    return <RegisterForm />
}

export default page
