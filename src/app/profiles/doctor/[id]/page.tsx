"use client"
import Appointments from "@/components/Dashboards/Doctors/Appoints/Appointments"
import Dashboard from "@/components/Dashboards/Doctors/Dash/Dashboard"
import History from "@/components/Dashboards/Doctors/Hist/History"
import ProfileSettings from "@/components/Dashboards/Doctors/MyInfo/ProfileSettings"
import Schedule from "@/components/Dashboards/Doctors/Scheds/Schedule"
import { SideBar } from "@/components/Dashboards/Doctors/SideBar"
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
    if (status === "authenticated" && session.user.role !== "doctor") {
        router.push("/forbidden")
        return null
    }

    if (status === "authenticated" && session.user.role === "doctor") {
        // Check if the user has a doctorId
        if (!session.user.doctorId) {
            router.push("/forbidden")
            return null
        }
        if (session.user.id !== Number(id)) {
            router.push("/forbidden")
            return null
        }
    }

    return (
        <Flex h={"100vh"}>
            <SideBar active={active} setActive={setActive} />
            <main style={{ flexGrow: 1, padding: "20px" }}>
                {active === "Dashboard" && <Dashboard />}
                {active === "Appointments" && <Appointments />}
                {active === "Schedule" && <Schedule />}
                {active === "Appointment History" && <History />}
                {active === "My Information" && <ProfileSettings />}
            </main>
        </Flex>
    )
}

export default page
