"use server"

import { signIn } from "next-auth/react"

interface RegisterUserFormData {
    email: string
    password: string
    fullName: string
}

export async function createUser(formData: RegisterUserFormData) {
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

    const data = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
    }
    const res = await fetch(`${BACKEND_API_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error("Failed to create user")
    }

    const result = await res.json()
    if (!result) {
        throw new Error("Failed to await user creation")
    }
    const user = result.user

    return user
}
