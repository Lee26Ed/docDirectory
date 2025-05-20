"use client"

import {
    Anchor,
    Box,
    Burger,
    Button,
    Divider,
    Drawer,
    Group,
    Modal,
    ScrollArea,
    Stack,
    Text,
    ThemeIcon,
    Title,
    useMantineTheme,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import classes from "./NavBar.module.css"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import UserMenu from "./UserMenu"
import { IconMail, IconPhone } from "@tabler/icons-react"

export function NavBar() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false)
    const [aboutModalOpened, { open: openAboutModal, close: closeAboutModal }] =
        useDisclosure(false)
    const [
        contactModalOpened,
        { open: openContactModal, close: closeContactModal },
    ] = useDisclosure(false)

    const { data: session, status } = useSession()

    if (status === "loading") {
        return (
            <Box pb={80}>
                <header className={classes.header}>
                    <Group justify='space-between' h='100%'>
                        <Link href='/'>
                            <Image
                                src='/favicon.svg'
                                alt='logo'
                                width={40}
                                height={40}
                            />
                        </Link>
                    </Group>
                </header>
            </Box>
        )
    }

    return (
        <Box
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
            }}
        >
            <header className={classes.header}>
                <Group justify='space-between' h='100%'>
                    <Link href='/'>
                        <Image
                            src='/favicon.svg'
                            alt='logo'
                            width={40}
                            height={40}
                        />
                    </Link>

                    <Group h='100%' gap={0} visibleFrom='sm'>
                        <a href='/' className={classes.link}>
                            Home
                        </a>

                        <a
                            href='#'
                            onClick={openAboutModal}
                            className={classes.link}
                        >
                            About Us
                        </a>
                        <a
                            href='#'
                            onClick={openContactModal}
                            className={classes.link}
                        >
                            Contact Us
                        </a>
                    </Group>

                    <Group visibleFrom='sm'>
                        {session?.user ? (
                            <>
                                <UserMenu user={session.user!} />
                            </>
                        ) : (
                            <>
                                <Link href='/auth/login'>
                                    <Button variant='default'>Log in</Button>
                                </Link>
                                <Link href='/auth/register'>
                                    <Button>Sign up</Button>
                                </Link>
                            </>
                        )}
                    </Group>

                    <Burger
                        opened={drawerOpened}
                        onClick={toggleDrawer}
                        hiddenFrom='sm'
                    />
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size='100%'
                padding='md'
                title='Navigation'
                hiddenFrom='sm'
                zIndex={1000000}
            >
                <ScrollArea h='calc(100vh - 80px' mx='-md'>
                    <Divider my='sm' />

                    <a href='/' className={classes.link}>
                        Home
                    </a>

                    <a href='/about' className={classes.link}>
                        About Us
                    </a>
                    <a href='/contact' className={classes.link}>
                        Contact Us
                    </a>

                    <Divider my='sm' />

                    <Group justify='center' grow pb='xl' px='md'>
                        {session?.user ? (
                            <>
                                <UserMenu user={session.user!} />
                                <Button onClick={() => signOut()}>
                                    Log Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href='/auth/login'>
                                    <Button variant='default'>Log in</Button>
                                </Link>
                                <Link href='/auth/register'>
                                    <Button>Sign up</Button>
                                </Link>
                            </>
                        )}
                    </Group>
                </ScrollArea>
            </Drawer>
            <Modal
                opened={aboutModalOpened}
                onClose={closeAboutModal}
                title={
                    <Group gap='xs'>
                        <Image
                            src='/favicon.svg'
                            alt='logo'
                            width={32}
                            height={32}
                        />
                        <Title order={4}>About Medi App</Title>
                    </Group>
                }
                centered
                size='lg'
                radius='md'
                padding='md'
            >
                <Stack gap='sm'>
                    <Divider />
                    <Text size='md' c='dimmed'>
                        Medi App is a cutting-edge healthcare platform designed
                        to connect patients with top medical professionals
                        seamlessly. Our mission is to simplify access to quality
                        healthcare by providing a user-friendly system for
                        booking appointments, managing medical records, and
                        receiving virtual consultations.
                    </Text>
                    <Text size='md' c='dimmed'>
                        With a focus on innovation and convenience, Medi App
                        ensures that healthcare is just a tap away. Experience
                        the future of healthcare today with Medi App.
                    </Text>
                </Stack>
            </Modal>
            <Modal
                opened={contactModalOpened}
                onClose={closeContactModal}
                title={
                    <Group gap='xs'>
                        <Image
                            src='/favicon.svg'
                            alt='logo'
                            width={32}
                            height={32}
                        />
                        <Title order={4}>Contact Us</Title>
                    </Group>
                }
                centered
                size='md'
                radius='md'
                padding='md'
            >
                <Stack gap='sm'>
                    <Divider />

                    <Group gap='xs'>
                        <ThemeIcon
                            variant='light'
                            color='blue'
                            radius='xl'
                            size='lg'
                        >
                            <IconMail size={18} />
                        </ThemeIcon>
                        <Anchor
                            href='mailto:support@MediApp.Bz'
                            target='_blank'
                            underline='hover'
                            size='sm'
                        >
                            support@MediApp.Bz
                        </Anchor>
                    </Group>

                    <Group gap='xs'>
                        <ThemeIcon
                            variant='light'
                            color='green'
                            radius='xl'
                            size='lg'
                        >
                            <IconPhone size={18} />
                        </ThemeIcon>
                        <Text size='sm'>+501 567-890</Text>
                    </Group>
                </Stack>
            </Modal>
        </Box>
    )
}
