import React from "react"
import { NavBar } from "@/components/NavBar/NavBar"
import { Footer } from "@/components/Footer/Footer"

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavBar />
            {children}
            <Footer />
        </>
    )
}

export default Layout
