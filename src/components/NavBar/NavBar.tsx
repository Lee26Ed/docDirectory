"use client"

import {
    Box,
    Burger,
    Button,
    Divider,
    Drawer,
    Group,
    ScrollArea,
    useMantineTheme,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import classes from "./NavBar.module.css"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

export function NavBar() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
        useDisclosure(false)

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

                    <Group h='100%' gap={0} visibleFrom='sm'>
                        <a href='/' className={classes.link}>
                            Home
                        </a>

                        <a href='/about' className={classes.link}>
                            About Us
                        </a>
                        <a href='/contact' className={classes.link}>
                            Contact Us
                        </a>
                    </Group>

                    <Group visibleFrom='sm'>
                        {session?.user ? (
                            <Button onClick={() => signOut()}>Log Out</Button>
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
                            <Button onClick={() => signOut()}>Log Out</Button>
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
        </Box>
    )
}
