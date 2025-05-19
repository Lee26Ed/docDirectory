"use client"
import Dashboard from "@/components/Dashboards/Doctors/Dash/Dashboard"
import History from "@/components/Dashboards/Doctors/Hist/History"
import ProfileSettings from "@/components/Dashboards/Doctors/MyInfo/ProfileSettings"
import Appointment from "@/components/Dashboards/Patients/Appointments/Appointment"
import { SideBar } from "@/components/Dashboards/Patients/SideBar"
import { Flex, Group } from "@mantine/core"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

const page = () => {
    const params = useParams()
    const { id } = params
    const router = useRouter()
    const { data: session, status } = useSession()
    const [active, setActive] = useState("Dashboard")

    if (status === "loading") {
        return <div>Loading...</div>
    }
    if (status === "unauthenticated") {
        router.push("/auth/login")
        return null
    }
    if (status === "authenticated" && session.user.role !== "patient") {
        router.push("/forbidden")
        return null
    }

    if (status === "authenticated" && session.user.role === "patient") {
        if (session.user.id !== Number(id)) {
            router.push("/forbidden")
            return null
        }
    }

    return (
        <Flex h={"100vh"}>
            <SideBar active={active} setActive={setActive} />
            <main style={{ flexGrow: 1, padding: "20px" }}>
                {active === "Dashboard" && <Dashboard setActive={setActive} />}
                {active === "Appointments" && <Appointment />}
                {active === "Appointment History" && <History />}
                {active === "My Information" && <ProfileSettings />}
            </main>
        </Flex>
    )
}

export default page
