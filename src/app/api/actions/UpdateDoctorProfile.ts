"use server"
interface UpdateDoctorProfile {
    doctorId: string
    fullName: string
    specialization: string
    yearsOfExperience: number
    medicalLicenseNumber: string
    email: string
    phone: string
    location: string
    biography: string
}

export async function updateDoctorProfile(
    formData: UpdateDoctorProfile,
    token: string
) {
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

    const data = {
        doctorId: formData.doctorId,
        fullName: formData.fullName,
        email: formData.email,
        licenseNumber: formData.medicalLicenseNumber,
        specialty: formData.specialization,
        experienceYears: formData.yearsOfExperience,
        location: formData.location,
        phone: formData.phone,
        bio: formData.biography,
    }
    try {
        const res = await fetch(`${BACKEND_API_URL}/api/v1/doctors/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })
        if (!res.ok) {
            console.log("not ok", res)
            throw new Error("Failed to update user")
        }

        const result = await res.json()
        if (!result) {
            throw new Error("Failed to update user")
        }

        const user = result.user
        if (!user) {
            throw new Error("Failed to update user")
        }
        return user
    } catch (error) {
        console.error("Error updating doctor:", error)
        throw new Error("Failed to update doctor")
    }
}
