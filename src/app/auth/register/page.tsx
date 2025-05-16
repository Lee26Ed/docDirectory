import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import RegisterForm from "@/components/auth/RegisterForm"
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
