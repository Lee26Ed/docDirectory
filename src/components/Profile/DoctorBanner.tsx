"use client"
import { Box, Button, Container, Text, TextInput, Title } from "@mantine/core"
import classes from "./doctorBanner.module.css"
import Image from "next/image"

interface DoctorBannerProps {
    doctorInfo: {
        name: string
        specialty: string
        profileImage: string
    }
}

const DoctorBanner = ({ doctorInfo }: DoctorBannerProps) => {
    return (
        <Container>
            <div className={classes.wrapper}>
                <Image
                    src={doctorInfo.profileImage}
                    alt='Doctor Banner'
                    width={400}
                    height={300}
                    className={classes.image}
                />
                <div className={classes.body}>
                    <Title className={classes.title}>{doctorInfo.name}</Title>
                    <Text fw={500} fz='lg' mb={5}>
                        Subscribe to our newsletter!
                    </Text>
                    <Text fz='sm' c='dimmed'>
                        You will never miss important product updates, latest
                        news and community QA sessions. Our newsletter is once a
                        week, every Sunday.
                    </Text>

                    <div className={classes.controls}>
                        <TextInput
                            placeholder='Your email'
                            classNames={{
                                input: classes.input,
                                root: classes.inputWrapper,
                            }}
                            radius='md'
                            size='md'
                        />
                        <Button
                            className={classes.control}
                            radius='md'
                            size='md'
                        >
                            Subscribe
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default DoctorBanner
