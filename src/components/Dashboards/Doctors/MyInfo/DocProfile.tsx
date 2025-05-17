import { useState } from "react"
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
    rem,
} from "@mantine/core"

export default function UserProfile() {
    const [photo, setPhoto] = useState(null)

    return (
        <Container size='xl' py='xl'>
            <Title order={2} mb='lg'>
                Users
            </Title>

            <Grid gutter='xl'>
                {/* Account Management Section */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <Box mb='md'>
                        <Avatar
                            src={photo ? URL.createObjectURL(photo) : undefined}
                            size={160}
                            radius='md'
                            mx='auto'
                        />
                        <FileButton
                            onChange={() => console.log("change")}
                            accept='image/*'
                        >
                            {(props) => (
                                <Button fullWidth mt='md' {...props}>
                                    Upload Photo
                                </Button>
                            )}
                        </FileButton>
                    </Box>

                    <PasswordInput
                        label='Old Password'
                        placeholder='••••••••'
                        mb='sm'
                    />
                    <PasswordInput
                        label='New Password'
                        placeholder='••••••••'
                        mb='sm'
                    />
                    <Button fullWidth mt='sm'>
                        Change Password
                    </Button>
                </Grid.Col>

                {/* Profile Information Section */}
                <Grid.Col span={{ base: 12, md: 8 }}>
                    <Title order={4} mb='sm'>
                        Profile Information
                    </Title>
                    <Grid gutter='md'>
                        <Grid.Col span={6}>
                            <TextInput
                                label='Username'
                                defaultValue='gene.rodrig'
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput label='First Name' defaultValue='Gene' />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput label='Nickname' defaultValue='Gene.r' />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Select
                                label='Role'
                                data={["Subscriber", "Admin", "Editor"]}
                                defaultValue='Subscriber'
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label='Last Name'
                                defaultValue='Rodriguez'
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label='Display Name Publicly as'
                                defaultValue='Gene'
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
                                defaultValue='gene.rodrig@gmail.com'
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label='WhatsApp'
                                defaultValue='@gene-rod'
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label='Website'
                                defaultValue='gene-rodrig.webflow.io'
                            />
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <TextInput
                                label='Telegram'
                                defaultValue='@gene-rod'
                            />
                        </Grid.Col>
                    </Grid>

                    <Divider my='lg' />

                    <Title order={4} mb='sm'>
                        About the User
                    </Title>
                    <Textarea
                        label='Biographical Info'
                        minRows={4}
                        defaultValue='Albert Einstein was a German mathematician and physicist who developed the special and general theories of relativity. In 1921, he won the Nobel Prize for physics for his explanation of the photoelectric effect. In the following decade.'
                    />
                </Grid.Col>
            </Grid>
        </Container>
    )
}
