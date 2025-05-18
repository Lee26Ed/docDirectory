"use client"
import {
    Anchor,
    Button,
    Container,
    Group,
    LoadingOverlay,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core"
import classes from "./login.module.css"
import { useRouter } from "next/navigation"
import { useForm } from "@mantine/form"
import { getSession, signIn } from "next-auth/react"
import { notifications } from "@mantine/notifications"
import { useDisclosure, useFocusTrap } from "@mantine/hooks"
import Link from "next/link"
import Image from "next/image"

const LoginForm = () => {
    const router = useRouter()
    const [visible, { open, close }] = useDisclosure(false)
    const focusTrapRef = useFocusTrap()

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            password: "",
        },
        validate: {
            email: (value) =>
                /^\S+@\S+$/.test(value) ? null : "Invalid email",
            password: (value) =>
                value.length >= 6
                    ? null
                    : "Password must include at least 6 characters",
        },
    })

    const handleSubmit = async (values: typeof form.values) => {
        open()

        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        })

        close()

        if (result?.ok) {
            const session = await getSession()
            const role = session?.user?.role

            if (role === "doctor") {
                router.push(`/profiles/doctor/${session?.user?.id}`)
            } else {
                router.back()
            }
        } else {
            notifications.show({
                title: "Login failed",
                message: "Invalid email or password",
                color: "red",
            })
        }
    }

    return (
        <Container size={420} my={30}>
            <LoadingOverlay
                visible={visible}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            <Stack align='center' gap='xs'>
                <Link href='/'>
                    <Image
                        src='/favicon.svg'
                        alt='logo'
                        width={50}
                        height={50}
                    />
                </Link>
                <Title ta='center' className={classes.title}>
                    Welcome back!
                </Title>

                <Text className={classes.subtitle}>
                    Do not have an account yet?{" "}
                    <Anchor href='/auth/register'>Create account</Anchor>
                </Text>
            </Stack>

            <Paper
                withBorder
                shadow='sm'
                p={22}
                mt={30}
                radius='md'
                ref={focusTrapRef}
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label='Email'
                        placeholder='you@mantine.dev'
                        required
                        radius='md'
                        {...form.getInputProps("email")}
                    />
                    <PasswordInput
                        label='Password'
                        placeholder='Your password'
                        required
                        mt='md'
                        radius='md'
                        {...form.getInputProps("password")}
                    />

                    <Group mt={20}>
                        <Button
                            variant='outline'
                            color='gray'
                            onClick={router.back}
                        >
                            Cancel
                        </Button>
                        <Button type='submit'>Sign in</Button>
                    </Group>
                </form>
            </Paper>
        </Container>
    )
}

export default LoginForm
