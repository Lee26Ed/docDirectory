"use server"
export const GetReviewDoctorsList = async (backendToken: string) => {
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
    const response = await fetch(
        `${BACKEND_API_URL}/api/v1/reviews/user/doctors`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${backendToken}`,
                "Content-Type": "application/json",
            },
        }
    )
    if (!response.ok) {
        throw new Error("Failed to fetch doctors list")
    }

    const data = await response.json()
    return data
}

interface ReviewFormData {
    doctorId: number
    appointmentId: number
    userId: number
    rating: number
    comment: string
}
export const SubmitReview = async (formData: ReviewFormData, token: string) => {
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL
    const response = await fetch(`${BACKEND_API_URL}/api/v1/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
    })
    if (!response.ok) {
        throw new Error("Failed to submit review")
    }

    const data = await response.json()
    return true
}
