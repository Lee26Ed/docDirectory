import {
    Badge,
    Box,
    Button,
    Container,
    Group,
    Rating,
    Text,
    TextInput,
    Title,
} from "@mantine/core"
import classes from "./doctorBanner.module.css"
import Image from "next/image"
import BookAppointment from "./BookAppointment"

interface DoctorBannerProps {
    doctorInfo: {
        name: string
        specialty: string
        profileImage: string
        location: string
        bio: string
        doctorId: string
        rating: number
    }
}

const DoctorBanner = ({ doctorInfo }: DoctorBannerProps) => {
    return (
        <Container>
            <div className={classes.wrapper}>
                <Image
                    src={`/docs/${doctorInfo.profileImage}`}
                    alt='Doctor Banner'
                    width={400}
                    height={300}
                    className={classes.image}
                />
                <div className={classes.body}>
                    <Title className={classes.title}>{doctorInfo.name}</Title>
                    <Badge color='green'>{doctorInfo.specialty}</Badge>

                    <Text>
                        <strong>Location:</strong> {doctorInfo.location}
                    </Text>
                    <Group>
                        <Text>
                            <strong>Rating: </strong>{" "}
                        </Text>
                        <Rating
                            fractions={4}
                            defaultValue={doctorInfo.rating}
                            readOnly
                        />
                    </Group>

                    <Text className={classes.description} mb={20}>
                        {doctorInfo.bio}
                    </Text>
                    <BookAppointment />
                </div>
            </div>
        </Container>
    )
}

export default DoctorBanner
