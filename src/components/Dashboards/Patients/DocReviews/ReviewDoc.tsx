import { useEffect, useState } from "react"
import { DoctorReviewCard } from "./DocReviewCards"
import { Container, Title } from "@mantine/core"
import { useSession } from "next-auth/react"
import { GetReviewDoctorsList } from "@/app/api/actions/ReviewDoctors"
import { notifications } from "@mantine/notifications"

const ReviewDoc = () => {
    const { data: session } = useSession()

    const [availableDoctors, setAvailableDoctors] = useState<ReviewDoctor[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!session) return
        const fetchDoctorList = async () => {
            try {
                const data = await GetReviewDoctorsList(session.backendToken)
                setAvailableDoctors(data)
            } catch (err: any) {
                setError(err.message || "Something went wrong")
                notifications.show({
                    title: "Error",
                    message: err.message || "Something went wrong",
                })
            } finally {
                setLoading(false)
            }
        }
        fetchDoctorList()
    }, [session])
    return (
        <Container>
            <Title order={2} mb='md'>
                Review Your Doctors
            </Title>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {availableDoctors.map((doctor) => (
                <DoctorReviewCard key={doctor.appointmentId} doctor={doctor} />
            ))}
        </Container>
    )
}

export default ReviewDoc
