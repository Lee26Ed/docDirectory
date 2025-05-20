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

interface Schedule {
    scheduleId: number
    doctorId: number
    workingDays: number[]
    from: string
    to: string
    duration: number
    downtime: number
    price: number
    createdAt: Date
    updatedAt: Date
}

interface Appointment {
    appointmentId: number
    doctorId: number
    userId: number
    fullName: string
    appointmentDate: Date
    time: string
    status: string
    duration: number
}

interface DoctorAppointment {
    id: number
    doctorId: number
    name: string
    gender: string
    description: string
    appointmentDate: Date
    time: string
    status: string
    duration: number
    createdAt: Date
}

interface ReviewDoctor {
    doctorId: number
    appointmentId: number
    userId: number
    fullName: string
    profileImage: string
    specialty: string
    location: string
    appointmentDate: string
    time: string
    reviewed: boolean
    status: string
}
