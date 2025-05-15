import {
    Card,
    Image,
    Text,
    Badge,
    Button,
    Group,
    AspectRatio,
    Spoiler,
} from "@mantine/core"
import { Doctor } from "@/types/doctor"
import { useRouter } from "next/navigation"

const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
    const router = useRouter()

    return (
        <Card
            shadow='sm'
            padding='lg'
            radius='md'
            withBorder
            maw={300}
            mah={400}
        >
            <Card.Section>
                <AspectRatio ratio={1080 / 720} maw={300} mx='auto'>
                    <Image
                        src={`/docs/${doctor.profileImage}`}
                        height={180}
                        alt={doctor.name}
                    />
                </AspectRatio>
            </Card.Section>

            <Group justify='space-between' mt='md' mb='xs'>
                <Text fw={500}>{doctor.name}</Text>
                <Badge color='green'>{doctor.specialty}</Badge>
            </Group>

            <Text size='sm' c='dimmed'>
                {doctor.location}
            </Text>
            <Text lineClamp={1}>{doctor.bio}</Text>

            <Button
                color='blue'
                fullWidth
                mt='md'
                radius='md'
                onClick={() => router.push(`/doctors/${doctor.doctorId}`)}
            >
                View Profile
            </Button>
        </Card>
    )
}

export default DoctorCard
