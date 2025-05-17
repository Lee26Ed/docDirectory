// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            name?: string
            email?: string
            image?: string
            id: number
            role: "doctor" | "patient" | "admin" // or string if dynamic
        }
        backendToken: string
    }

    interface User {
        id: number
        role: "doctor" | "patient" | "admin"
    }
}
