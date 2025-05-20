"use server"

export const GetDoctorAppointments = async (token: string) => {
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
    const response = await fetch(`${BACKEND_API_URL}/api/v1/appointments`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error("Failed to fetch doctor appointments")
    }
    const data = await response.json()
    if (!Array.isArray(data.appointments)) {
        throw new Error("Expected an array of appointments")
    }

    const preparedData = data.appointments.map(
        (appointment: DoctorAppointment) => ({
            ...appointment,
            start: new Date(
                `${appointment.appointmentDate}T${appointment.time}`
            ),
            end: new Date(
                new Date(
                    `${appointment.appointmentDate}T${appointment.time}`
                ).getTime() +
                    appointment.duration * 60000
            ),
            title: appointment.name,
        })
    )

    return preparedData
}

export const HandleDoctorAppointmentAction = async (
    appointmentId: number,
    token: string,
    action: "accepted" | "rejected" | "cancelled"
) => {
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
    const response = await fetch(
        `${BACKEND_API_URL}/api/v1/appointments/${appointmentId}/status`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: action }),
        }
    )

    if (!response.ok) {
        throw new Error("Failed to update appointment status")
    }
    const data = await response.json()
    return true
}
