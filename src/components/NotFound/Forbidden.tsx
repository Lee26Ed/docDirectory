"use client"

import {
    Button,
    Container,
    Group,
    Image,
    Stack,
    Text,
    Title,
} from "@mantine/core"
import { IconShieldOff } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

export default function ForbiddenPage() {
    const router = useRouter()

    return (
        <Container size='md' py={80} style={{ textAlign: "center" }}>
            <Stack align='center' gap='lg'>
                <IconShieldOff size={64} strokeWidth={1.5} color='red' />

                <Title order={1} size='2.5rem' fw={700}>
                    403 - Forbidden
                </Title>

                <Text color='dimmed' size='md'>
                    You don't have permission to access this page. Please
                    contact an administrator if you think this is a mistake.
                </Text>

                <Group mt='md'>
                    <Button
                        variant='filled'
                        color='blue'
                        size='md'
                        onClick={() => router.push("/")}
                    >
                        Go back home
                    </Button>
                </Group>
            </Stack>
        </Container>
    )
}
