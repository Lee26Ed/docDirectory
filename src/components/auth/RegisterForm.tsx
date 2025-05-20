// components/RegisterForm.tsx
"use client" // Mark this as a Client Component as it uses hooks and interactivity

import { useState } from "react"
import {
    Tabs,
    TextInput,
    PasswordInput,
    Button,
    Stack,
    Title,
    Select,
    Container,
    Paper,
    Text,
    Anchor,
    Group,
    NumberInput,
    Textarea,
    LoadingOverlay,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconUser, IconStethoscope } from "@tabler/icons-react"
import Link from "next/link"
import { useDisclosure, useFocusTrap } from "@mantine/hooks"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createUser } from "@/app/actions/RegisterUser"
import { signIn } from "next-auth/react"
import { notifications } from "@mantine/notifications"
import { createDoctor } from "@/app/actions/RegisterDoctor"

// Define interfaces for form values
interface UserRegisterFormValues {
    fullName: string
    email: string
    password: string
    confirmPassword: string
}

interface DoctorRegisterFormValues {
    fullName: string
    email: string
    password: string
    confirmPassword: string
    medicalLicenseNumber: string
    specialization: string
    yearsOfExperience: number
    location: string
    phone: string
    biography?: string
}

export default function RegisterForm() {
    const [activeTab, setActiveTab] = useState<string | null>("user")
    const focusTrapRef = useFocusTrap()
    const router = useRouter()
    const [visible, { open, close }] = useDisclosure(false)

    // Form hook for User Registration
    const userForm = useForm<UserRegisterFormValues>({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validate: {
            fullName: (value) =>
                value.length < 2
                    ? "Full name must have at least 2 letters"
                    : null,
            email: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email",
            password: (value) =>
                value.length < 6
                    ? "Password must have at least 6 characters"
                    : null,
            confirmPassword: (value, values) =>
                value !== values.password ? "Passwords did not match" : null,
        },
    })

    // Form hook for Doctor Registration
    const doctorForm = useForm<DoctorRegisterFormValues>({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            medicalLicenseNumber: "",
            specialization: "",
            yearsOfExperience: 0,
            location: "",
            phone: "",
            biography: "",
        },
        validate: {
            fullName: (value) =>
                value.length < 2
                    ? "Full name must have at least 2 letters"
                    : null,
            email: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email",
            password: (value) =>
                value.length < 6
                    ? "Password must have at least 6 characters"
                    : null,
            confirmPassword: (value, values) =>
                value !== values.password ? "Passwords did not match" : null,
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

    // Handle User Registration Submission
    const handleUserSubmit = async (values: UserRegisterFormValues) => {
        open()
        try {
            const user = await createUser(values)

            // User created successfully
            await signIn("credentials", {
                email: values.email,
                password: values.password,
                callbackUrl: `/profiles/user/${user.userId}`,
            })
        } catch (error) {
            console.error("Error creating user:", error)
            const message =
                error instanceof Error ? error.message : "Something went wrong"

            notifications.show({
                title: "Registration failed",
                message,
                color: "red",
            })
        } finally {
            close()
        }
    }

    // Handle Doctor Registration Submission
    const handleDoctorSubmit = async (values: DoctorRegisterFormValues) => {
        open()
        try {
            const user = await createDoctor(values)

            // Doctor created successfully
            await signIn("credentials", {
                email: values.email,
                password: values.password,
                callbackUrl: `/profiles/doctor/${user.userId}`,
            })
        } catch (error) {
            console.error("Error creating doctor:", error)
            const message =
                error instanceof Error ? error.message : "Something went wrong"
            notifications.show({
                title: "Registration failed",
                message,
                color: "red",
            })
        } finally {
            close()
        }
    }

    return (
        <Container size={520} my={30}>
            <Stack align='center' gap='xs'>
                <Link href='/'>
                    <Image
                        src='/favicon.svg'
                        alt='logo'
                        width={50}
                        height={50}
                    />
                </Link>
                <Title order={2} mb='lg' ta='center'>
                    Create an Account
                </Title>

                <Text c='dimmed' size='sm' ta='center'>
                    Already have an account?{" "}
                    <Anchor component={Link} href='/auth/login' size='sm'>
                        Sign in
                    </Anchor>
                </Text>
            </Stack>

            <Paper withBorder shadow='sm' p={22} mt='md' radius='md'>
                <LoadingOverlay
                    visible={visible}
                    zIndex={1000}
                    overlayProps={{ radius: "sm", blur: 2 }}
                />
                <Tabs
                    value={activeTab}
                    onChange={setActiveTab}
                    variant='outline'
                    radius='md'
                >
                    <Tabs.List grow>
                        <Tabs.Tab
                            value='user'
                            leftSection={<IconUser size={18} />}
                        >
                            User
                        </Tabs.Tab>
                        <Tabs.Tab
                            value='doctor'
                            leftSection={<IconStethoscope size={18} />}
                        >
                            Doctor
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value='user' pt='xs'>
                        <form onSubmit={userForm.onSubmit(handleUserSubmit)}>
                            <Stack>
                                <TextInput
                                    label='Full Name'
                                    placeholder='Your full name'
                                    required
                                    radius='md'
                                    {...userForm.getInputProps("fullName")}
                                />
                                <TextInput
                                    label='Email'
                                    placeholder='your@email.com'
                                    required
                                    radius='md'
                                    {...userForm.getInputProps("email")}
                                />
                                <PasswordInput
                                    label='Password'
                                    placeholder='Your password'
                                    required
                                    radius='md'
                                    {...userForm.getInputProps("password")}
                                />
                                <PasswordInput
                                    label='Confirm Password'
                                    placeholder='Confirm your password'
                                    required
                                    radius='md'
                                    {...userForm.getInputProps(
                                        "confirmPassword"
                                    )}
                                />
                                <Group>
                                    <Button
                                        variant='outline'
                                        color='gray'
                                        onClick={router.back}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type='submit'>Register User</Button>
                                </Group>
                            </Stack>
                        </form>
                    </Tabs.Panel>

                    <Tabs.Panel value='doctor' pt='xs'>
                        <form
                            onSubmit={doctorForm.onSubmit(handleDoctorSubmit)}
                        >
                            <Stack>
                                <Group grow>
                                    <TextInput
                                        label='Full Name'
                                        placeholder='Your full name'
                                        required
                                        radius='md' // Apply radius
                                        {...doctorForm.getInputProps(
                                            "fullName"
                                        )}
                                    />
                                    <TextInput
                                        label='Email'
                                        placeholder='your@email.com'
                                        required
                                        radius='md' // Apply radius
                                        {...doctorForm.getInputProps("email")}
                                    />
                                </Group>
                                <Group grow>
                                    <PasswordInput
                                        label='Password'
                                        placeholder='Your password'
                                        required
                                        radius='md' // Apply radius
                                        {...doctorForm.getInputProps(
                                            "password"
                                        )}
                                    />
                                    <PasswordInput
                                        label='Confirm Password'
                                        placeholder='Confirm your password'
                                        required
                                        radius='md' // Apply radius
                                        {...doctorForm.getInputProps(
                                            "confirmPassword"
                                        )}
                                    />
                                </Group>
                                <Group grow>
                                    <TextInput
                                        label='Medical License Number'
                                        placeholder='Medical license number'
                                        required
                                        radius='md' // Apply radius
                                        {...doctorForm.getInputProps(
                                            "medicalLicenseNumber"
                                        )}
                                    />
                                    <NumberInput
                                        label='Years of Experience'
                                        placeholder='Years of experience'
                                        required
                                        radius='md'
                                        min={0}
                                        max={100}
                                        clampBehavior='strict'
                                        {...doctorForm.getInputProps(
                                            "yearsOfExperience"
                                        )}
                                    />
                                </Group>
                                <TextInput
                                    label='Specialization'
                                    placeholder='Your specialization'
                                    required
                                    radius='md' // Apply radius
                                    {...doctorForm.getInputProps(
                                        "specialization"
                                    )}
                                />

                                <Group grow>
                                    <TextInput
                                        label='Location'
                                        placeholder='Your location'
                                        required
                                        radius='md' // Apply radius
                                        {...doctorForm.getInputProps(
                                            "location"
                                        )}
                                    />
                                    <TextInput
                                        label='Phone'
                                        placeholder='Your phone number'
                                        required
                                        radius='md' // Apply radius
                                        {...doctorForm.getInputProps("phone")}
                                    />
                                </Group>
                                <Textarea
                                    label='Biography'
                                    placeholder='Tell us about yourself'
                                    radius='md' // Apply radius
                                    {...doctorForm.getInputProps("biography")}
                                />
                                <Group>
                                    <Button
                                        variant='outline'
                                        color='gray'
                                        onClick={router.back}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type='submit'>
                                        Register Doctor
                                    </Button>
                                </Group>
                            </Stack>
                        </form>
                    </Tabs.Panel>
                </Tabs>
            </Paper>
        </Container>
    )
}
