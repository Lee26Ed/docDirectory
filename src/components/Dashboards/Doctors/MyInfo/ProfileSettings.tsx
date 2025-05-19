import React, { useEffect, useState } from "react"
import DocProfile from "./DocProfile"
import { useSession } from "next-auth/react"
import useFetch from "@/hooks/useFetch"

interface Doctor {
    doctorId: string
    name: string
    specialty: string
    experience: number
    licenseNumber: string
    email: string
    phone: string
    location: string
    bio: string
    profileImage: string
}

const ProfileSettings = () => {
    const { data: session } = useSession()
    if (!session) {
        return <div>Loading...</div>
    }
    const user = session.user

    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

    // get the doctor data from the backend
    const {
        data: doctor,
        loading,
        error,
        refetch,
    } = useFetch<Doctor>({
        url: `${BACKEND_API_URL}/api/v1/doctors/${user.doctorId}`,
        config: {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.backendToken}`,
            },
        },
    })

    // get the doctor's schedule data from the backend
    const {
        data: schedule,
        loading: scheduleLoading,
        error: scheduleError,
        refetch: scheduleRefetch,
    } = useFetch<Schedule>({
        url: `${BACKEND_API_URL}/api/v1/schedule`,
        config: {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.backendToken}`,
            },
        },
    })

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error loading doctor profile.</div>
    if (!doctor) return <div>No profile found.</div>

    return (
        <DocProfile
            doctor={doctor}
            refetch={refetch}
            schedule={schedule}
            scheduleRefetch={scheduleRefetch}
        />
    )
}

export default ProfileSettings
