// pages/api/auth/[...nextauth].js (Pages Router)
// or app/api/auth/[...nextauth]/route.js (App Router - slightly different export)

import NextAuth, { AuthOptions, SessionStrategy } from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL // Define this in your .env file

export const authOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    console.error("No credentials provided")
                    return null
                }

                console.log(`${BACKEND_API_URL}/api/v1/auth/login`)
                try {
                    const response = await fetch(
                        `${BACKEND_API_URL}/api/v1/auth/login`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: credentials!.email,
                                password: credentials!.password,
                            }),
                        }
                    )

                    if (!response.ok) {
                        console.error("Backend login failed:", response.status)
                        return null
                    }

                    const data = await response.json()

                    if (data.user && data.token) {
                        // return a user object with the user data and token
                        const user = {
                            id: data.user.userId,
                            name: data.user.fullName,
                            email: data.user.email,
                            role: data.user.role,
                            backendToken: data.token,
                        }
                        console.log("User authenticated successfully:", user)
                        return user
                    } else {
                        console.error(
                            "Backend response missing user or token:",
                            data
                        )
                        return null
                    }
                } catch (error) {
                    console.error("Error calling backend login API:", error)
                    return null
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }: { token: any; user: any }) {
            // The `user` object is only available on the first call after `authorize` succeeds
            if (user) {
                token.id = user.id
                token.backendToken = user.backendToken // Persist the backend token in the NextAuth.js JWT
                // Persist other user data you need in the token
                token.name = user.name
                token.email = user.email
                token.role = user.role
            }
            // Return the token.
            return token
        },
        async session({ session, token }: { session: any; token: any }) {
            // The `session` object is what's exposed to the client-side via useSession()
            // Add the data from the token to the session object
            session.user.id = token.id
            session.backendToken = token.backendToken // Make the backend token available on the client session
            // Add other data from the token to the session user object
            session.user.name = token.name
            session.user.email = token.email
            session.user.role = token.role
            return session
        },
    },
    session: {
        strategy: "jwt" as SessionStrategy, // 👈 Explicitly cast the string
        maxAge: 30 * 24 * 60 * 60,
    },
    // Configure pages
    pages: {
        signIn: "/auth/signin", // Specify your custom login page path
        // error: '/auth/error', // Optional: Custom error page
        // signOut: '/auth/signout', // Optional: Custom signout page
    },
    secret: process.env.NEXTAUTH_SECRET,
}
// For App Router (app/api/auth/[...nextauth]/route.js):
export const GET = NextAuth(authOptions)
export const POST = NextAuth(authOptions)
