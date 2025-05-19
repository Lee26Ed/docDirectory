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

const defaultSchedule = {
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    from: "09:00",
    to: "17:00",
    duration: 30,
    downtime: 0,
    price: 50,
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
        const user = result[0]
        return user
    } catch (error) {
        console.error("Error creating doctor:", error)
        throw new Error("Failed to create doctor")
    }
}
