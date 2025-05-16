import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LoginForm from "@/components/auth/LoginForm"
import { Center, Container, Paper, Stack } from "@mantine/core"
import { getServerSession } from "next-auth"
import React from "react"
import { redirect } from "next/navigation"

const page = async () => {
    const session = await getServerSession(authOptions)

    if (session) {
        redirect("/")
    }

    return (
        <Center h={"100vh"} bg={"#f5f5f5"}>
            <Paper shadow='xl' p='xl'>
                <LoginForm />
            </Paper>
        </Center>
    )
}

export default page
