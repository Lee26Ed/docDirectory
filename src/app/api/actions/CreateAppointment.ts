export const GetUnavailableTimes = async (
    date: Date | null,
    doctorId: number | undefined,
    token: string
) => {
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
    const response = await fetch(
        `${BACKEND_API_URL}/api/v1/schedule/unavailable`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                doctorId,
                date,
            }),
        }
    )
    if (!response.ok) {
        throw new Error("Failed to fetch unavailable times")
    }
    const data = await response.json()
    console.log("Unavailable times:", data)
    return data
}

interface CreateAppointmentFormData {
    doctorId: number
    duration: number
    price: number
    appointmentDate: Date | null
    description: string
    gender: string
    name: string
    time: string | null
}
export const CreateAppointment = async (
    FormData: CreateAppointmentFormData,
    token: string
) => {
    console.log("Prepared data:", FormData)
    const newTime = FormData.time!.split(":")
    const result = newTime.slice(0, 2).join(":")
    console.log("Result:", result)
    const preparedData = {
        ...FormData,
        time: result,
    }
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
    const response = await fetch(`${BACKEND_API_URL}/api/v1/appointments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preparedData),
    })

    if (!response.ok) {
        throw new Error("Failed to create appointment")
    }
    const data = await response.json()
    console.log("Created appointment:", data)
    return data
}
