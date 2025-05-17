"use client"
import Appointments from "@/components/Dashboards/Doctors/Appoints/Appointments"
import Dashboard from "@/components/Dashboards/Doctors/Dash/Dashboard"
import History from "@/components/Dashboards/Doctors/History"
import ProfileSettings from "@/components/Dashboards/Doctors/ProfileSettings"
import Schedule from "@/components/Dashboards/Doctors/Schedule"
import { SideBar } from "@/components/Dashboards/Doctors/SideBar"
import { Flex, Group } from "@mantine/core"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const page = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const [active, setActive] = useState("Dashboard")

    // console.log(session)
    // if (!session) {
    //     router.push("/auth/login")
    //     return null
    // }

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
