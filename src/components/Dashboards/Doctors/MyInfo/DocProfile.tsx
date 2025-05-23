"use client"
import {
    updateDoctorPassword,
    updateDoctorProfile,
} from "@/app/actions/UpdateDoctorProfile"
import {
    Container,
    Grid,
    TextInput,
    PasswordInput,
    Textarea,
    Button,
    Select,
    Avatar,
    FileButton,
    Title,
    Divider,
    Box,
    Group,
    NumberInput,
    Tabs,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { useSession } from "next-auth/react"
import ScheduleSetup from "../Scheds/ScheduleForm"

interface Doctor {
    doctorId: string
    name: string
    specialty: string
    experience: number
    licenseNumber: string
    email: string
    phone: string
    location: string
    bio: string
    profileImage: string
}

export default function DocProfile({
    doctor,
    refetch,
    schedule,
    scheduleRefetch,
}: {
    doctor: Doctor
    refetch: () => void
    schedule: Schedule | null
    scheduleRefetch: () => void
}) {
    const { data: session } = useSession()
    if (!session) {
        return <div>Loading...</div>
    }
    const passwordForm = useForm({
        initialValues: {
            oldPassword: "",
            newPassword: "",
        },
        validate: {
            newPassword: (value) =>
                value.length >= 6
                    ? null
                    : "Password must include at least 6 characters",
        },
    })

    const profileForm = useForm({
        initialValues: {
            firstName: doctor.name.split(" ")[0],
            lastName: doctor.name.split(" ")[1],
            email: doctor.email,
            phone: doctor.phone,
            medicalLicenseNumber: doctor.licenseNumber,
            specialization: doctor.specialty,
            yearsOfExperience: doctor.experience,
            location: doctor.location,
            biography: doctor.bio,
        },
        validate: {
            firstName: (value) =>
                value.length < 2
                    ? "Full name must have at least 2 letters"
                    : null,
            lastName: (value) =>
                value.length < 2
                    ? "Full name must have at least 2 letters"
                    : null,
            email: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email",
            medicalLicenseNumber: (value) =>
                value.length > 0 ? null : "Medical license number is required",
            specialization: (value) =>
                value.length > 0 ? null : "Specialization is required",
            yearsOfExperience: (value) =>
                value > 0 ? null : "Years of experience must be greater than 0",
            location: (value) =>
                value.length > 0 ? null : "Location is required",
            phone: (value) =>
                /^\+?[1-9]\d{1,14}$/.test(value)
                    ? null
                    : "Invalid phone number",
        },
    })

    const photoForm = useForm({
        initialValues: {
            photo: null as File | null,
        },
    })

    const handlePasswordSubmit = async (values: typeof passwordForm.values) => {
        const preparedData = {
            doctorId: Number(doctor.doctorId),
            ...values,
        }
        try {
            await updateDoctorPassword(preparedData, session.backendToken)
            notifications.show({
                title: "Success",
                message: "Password updated successfully",
                color: "teal",
            })
            passwordForm.reset()
        } catch (error) {
            console.error("Error updating password:", error)
            notifications.show({
                title: "Error",
                message: "Failed to update password",
                color: "red",
            })
        }
    }

    const handleProfileSubmit = async (values: typeof profileForm.values) => {
        const { firstName, lastName, ...rest } = values
        const updatedProfile = {
            ...rest,
            fullName: `${firstName} ${lastName}`,
            doctorId: doctor.doctorId,
        }
        try {
            await updateDoctorProfile(updatedProfile, session.backendToken)
            notifications.show({
                title: "Success",
                message: "Profile updated successfully",
                color: "teal",
            })
            refetch()
            profileForm.resetTouched()
        } catch (error) {
            console.error("Error updating profile:", error)
            notifications.show({
                title: "Error",
                message: "Failed to update profile",
                color: "red",
            })
        }
    }

    const handlePhotoSubmit = (values: { photo: File | null }) => {
        // TODO: write function to upload the photo
        if (!values.photo) return
        // perform your upload logic here (e.g., using FormData + axios)
        console.log("Uploading photo:", values.photo)
        photoForm.setFieldValue("photo", null)
    }

    return (
        <Container size='xl' py='xl'>
            <Group justify='space-between'>
                <Title order={2} mb='sm'>
                    {doctor.name}
                </Title>
            </Group>

            <Grid gutter='xl'>
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <form onSubmit={photoForm.onSubmit(handlePhotoSubmit)}>
                        <Box mb='xl' mt={"xl"}>
                            <Avatar
                                src={
                                    photoForm.values.photo
                                        ? URL.createObjectURL(
                                              photoForm.values.photo
                                          )
                                        : `/docs/${doctor.profileImage}` // get image from doctor data
                                }
                                size={160}
                                radius='md'
                                mx='auto'
                            />
                            {!photoForm.values.photo && (
                                <FileButton
                                    accept='image/*'
                                    {...photoForm.getInputProps("photo")}
                                    onChange={(file) =>
                                        photoForm.setFieldValue("photo", file)
                                    }
                                >
                                    {(props) => (
                                        <Button fullWidth mt='md' {...props}>
                                            Upload Photo
                                        </Button>
                                    )}
                                </FileButton>
                            )}
                            {photoForm.values.photo && (
                                <>
                                    <Button fullWidth mt='md' type='submit'>
                                        Save Photo
                                    </Button>
                                    <Button
                                        fullWidth
                                        mt='md'
                                        variant='outline'
                                        onClick={() =>
                                            photoForm.setFieldValue(
                                                "photo",
                                                null
                                            )
                                        }
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </Box>
                    </form>

                    <form
                        onSubmit={passwordForm.onSubmit(handlePasswordSubmit)}
                    >
                        <PasswordInput
                            label='Old Password'
                            placeholder='••••••••'
                            mb='sm'
                            key={passwordForm.key("oldPassword")}
                            {...passwordForm.getInputProps("oldPassword")}
                        />
                        <PasswordInput
                            label='New Password'
                            placeholder='••••••••'
                            mb='sm'
                            key={passwordForm.key("newPassword")}
                            {...passwordForm.getInputProps("newPassword")}
                        />
                        <Button fullWidth mt='sm' type='submit'>
                            Change Password
                        </Button>
                    </form>
                </Grid.Col>

                {/* Profile Information Section */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Tabs variant='outline' defaultValue='profile'>
                        <Tabs.List mb={"md"}>
                            <Tabs.Tab value='profile'>Profile</Tabs.Tab>
                            <Tabs.Tab value='Schedule'>Schedule</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value='profile' pt='xs'>
                            <form
                                onSubmit={profileForm.onSubmit(
                                    handleProfileSubmit
                                )}
                            >
                                <Grid gutter='md'>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label='First Name'
                                            key={profileForm.key("firstName")}
                                            {...profileForm.getInputProps(
                                                "firstName"
                                            )}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label='Last Name'
                                            key={profileForm.key("lastName")}
                                            {...profileForm.getInputProps(
                                                "lastName"
                                            )}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label='Specialization'
                                            key={profileForm.key(
                                                "specialization"
                                            )}
                                            {...profileForm.getInputProps(
                                                "specialization"
                                            )}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <NumberInput
                                            label='Years of Experience'
                                            key={profileForm.key(
                                                "yearsOfExperience"
                                            )}
                                            {...profileForm.getInputProps(
                                                "yearsOfExperience"
                                            )}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label='License Number'
                                            key={profileForm.key(
                                                "medicalLicenseNumber"
                                            )}
                                            {...profileForm.getInputProps(
                                                "medicalLicenseNumber"
                                            )}
                                        />
                                    </Grid.Col>
                                </Grid>

                                <Divider my='lg' />

                                <Title order={4} mb='sm'>
                                    Contact Info
                                </Title>
                                <Grid gutter='md'>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label='Email (required)'
                                            key={profileForm.key("email")}
                                            {...profileForm.getInputProps(
                                                "email"
                                            )}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label='Phone'
                                            key={profileForm.key("phone")}
                                            {...profileForm.getInputProps(
                                                "phone"
                                            )}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <TextInput
                                            label='Location'
                                            key={profileForm.key("location")}
                                            {...profileForm.getInputProps(
                                                "location"
                                            )}
                                        />
                                    </Grid.Col>
                                </Grid>

                                <Divider my='lg' />

                                <Title order={4} mb='sm'>
                                    About Me
                                </Title>
                                <Textarea
                                    label='Biographical Info'
                                    minRows={4}
                                    key={profileForm.key("biography")}
                                    {...profileForm.getInputProps("biography")}
                                />
                                {profileForm.isTouched() && (
                                    <>
                                        <Button
                                            fullWidth
                                            mt='sm'
                                            type='submit'
                                            color='teal'
                                            variant='outline'
                                        >
                                            Update Profile
                                        </Button>
                                        <Button
                                            fullWidth
                                            mt='sm'
                                            color='gray'
                                            variant='outline'
                                            onClick={profileForm.reset}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </form>
                        </Tabs.Panel>
                        <Tabs.Panel value='Schedule' pt='xs'>
                            <ScheduleSetup
                                schedule={schedule}
                                refetch={scheduleRefetch}
                            />
                        </Tabs.Panel>
                    </Tabs>
                </Grid.Col>
            </Grid>
        </Container>
    )
}
