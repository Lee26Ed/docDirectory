import { Card, Group, Text, Button, Stack, Badge } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import Image from "next/image"
import ReviewModal from "./ReviewModal"
import { useState } from "react"

interface DoctorReviewCardProps {
    doctor: ReviewDoctor
}

export function DoctorReviewCard({ doctor }: DoctorReviewCardProps) {
    const [opened, { open, close }] = useDisclosure(false)
    const [reviewed, setReviewed] = useState(doctor.reviewed)
    return (
        <Card
            shadow='sm'
            padding='md'
            radius='md'
            withBorder
            style={{ width: "100%" }}
            key={doctor.appointmentId}
            mb={10}
        >
            <Group>
                <Image
                    src={`/docs/${doctor.profileImage}` || "/docs/p002.png"}
                    alt={doctor.fullName}
                    width={120}
                    height={120}
                />

                <Stack gap={4} style={{ flex: 1 }}>
                    <Text fw={600} size='lg'>
                        {doctor.fullName}
                    </Text>
                    <Badge size='sm' c='dimmed' variant='outline' color='green'>
                        {doctor.specialty}
                    </Badge>
                    <Text size='sm' c='dimmed'>
                        {doctor.location}
                    </Text>
                    <Text size='sm' c='dimmed'>
                        <strong>For Appointment on: </strong>
                        {doctor.appointmentDate} {doctor.time}
                    </Text>
                </Stack>

                <Button
                    disabled={reviewed}
                    variant={reviewed ? "outline" : "filled"}
                    onClick={open}
                >
                    {reviewed ? "Reviewed" : "Leave a Review"}
                </Button>
            </Group>
            <ReviewModal
                opened={opened}
                close={close}
                doctorId={doctor.doctorId}
                appointmentId={doctor.appointmentId}
                userId={doctor.userId}
                setReviewed={setReviewed}
            />
        </Card>
    )
}
