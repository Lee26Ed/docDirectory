"use server"

interface RegisterDoctorFormData {
    fullName: string
    email: string
    password: string
    confirmPassword: string
    medicalLicenseNumber: string
    specialization: string
    yearsOfExperience: number
    location: string
    phone: string
    biography?: string
    profileImage?: string
}

export async function createDoctor(formData: RegisterDoctorFormData) {
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

    const data = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        licenseNumber: formData.medicalLicenseNumber,
        specialty: formData.specialization,
        experienceYears: formData.yearsOfExperience,
        location: formData.location,
        phone: formData.phone,
        bio: formData.biography,
        profileImage: formData.profileImage || "f001.png",
    }
    console.log(data)
    try {
        const res = await fetch(
            `${BACKEND_API_URL}/api/v1/auth/register/doctor`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        )
        if (!res.ok) {
            throw new Error("Failed to create user")
        }

        const result = await res.json()
        if (!result) {
            throw new Error("Failed to create user")
        }

        const user = result.user
        if (!user) {
            throw new Error("Failed to create user")
        }
        return user
    } catch (error) {
        console.error("Error creating doctor:", error)
        throw new Error("Failed to create doctor")
    }
}
