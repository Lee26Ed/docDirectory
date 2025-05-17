interface User {
    userId: number
    fullName: string
    email: string
    password?: string
    role: string
}

interface Doctor extends User {
    doctorId: number
    licenseNumber?: string
    profileImage: string | null
    experienceYears?: number | null
    status?: string
    bio: string | null
    location: string | null
    phone: string | null
    specialty: string | null
    rating?: number | null
}
