import DoctorBanner from "@/components/Profile/DoctorBanner"
import React from "react"

const page = async ({ params }: { params: { id: string } }) => {
    const id = await params.id
    console.log(id)
    const res = await fetch(`http://localhost:3000/api/v1/doctors/${id}`, {
        next: { revalidate: 60 },
    })
    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }
    console.log(res)
    const doctorInfo = {
        name: res.name,
        specialty: res.specialty,
        profileImage: res.profileImage,
    }

    return <DoctorBanner doctorInfo={res} />
}

export default page
