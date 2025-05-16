import DoctorBanner from "@/components/Profile/DoctorBanner"
import DoctorReviews from "@/components/Profile/DoctorReviews"
import { Stack } from "@mantine/core"
import { getTimeRange, TimeGrid } from "@mantine/dates"
import React from "react"

type Params = Promise<{ id: string }>

const page = async ({ params }: { params: Params }) => {
    const { id } = await params

    const res = await fetch(`http://localhost:5000/api/v1/doctors/${id}`, {
        next: { revalidate: 60 },
    })
    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }
    const doctorInfo = await res.json()

    const reviewsRes = await fetch(
        `http://localhost:5000/api/v1/reviews/doctor/${id}`,
        {
            next: { revalidate: 60 },
        }
    )
    if (!reviewsRes.ok) {
        throw new Error("Failed to fetch data")
    }
    const reviews = await reviewsRes.json()

    return (
        <Stack>
            <DoctorBanner doctorInfo={doctorInfo} />

            <DoctorReviews reviews={reviews} />
        </Stack>
    )
}

export default page
