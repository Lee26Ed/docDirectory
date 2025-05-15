"use client"
import {
    IconBrandInstagram,
    IconBrandTwitter,
    IconBrandYoutube,
} from "@tabler/icons-react"
import { ActionIcon, Container, Group, Text } from "@mantine/core"
// import { MantineLogo } from "@mantinex/mantine-logo"
import classes from "./footer.module.css"
import Link from "next/link"
import Image from "next/image"

const data = [
    {
        title: "Quick links",
        links: [
            { label: "Home", link: "/" },
            { label: "About", link: "/about" },
            { label: "Contact Us", link: "/contact" },
            { label: "Sign Up as a Doctor", link: "/signup-doctor" },
            { label: "Create an Account", link: "/signup" },
        ],
    },
]

export function Footer() {
    const groups = data.map((group) => {
        const links = group.links.map((link, index) => (
            <Text<"a">
                key={index}
                className={classes.link}
                component='a'
                href={link.link}
                onClick={(event) => event.preventDefault()}
            >
                {link.label}
            </Text>
        ))

        return (
            <div className={classes.wrapper} key={group.title}>
                <Text className={classes.title}>{group.title}</Text>
                {links}
            </div>
        )
    })

    return (
        <footer className={classes.footer}>
            <Container className={classes.inner}>
                <div className={classes.logo}>
                    <Link href='/'>
                        <Image
                            src='/favicon.svg'
                            alt='logo'
                            width={70}
                            height={70}
                        />
                    </Link>
                    <Text size='xs' c='dimmed' className={classes.description}>
                        Your trusted platform for finding and connecting with
                        top healthcare providers.
                    </Text>
                </div>
                <div className={classes.groups}>{groups}</div>
            </Container>
            <Container className={classes.afterFooter}>
                <Text c='dimmed' size='sm'>
                    © 2025 MediApp.dev. All rights reserved.
                </Text>

                <Group
                    gap={0}
                    className={classes.social}
                    justify='flex-end'
                    wrap='nowrap'
                >
                    <ActionIcon size='lg' color='gray' variant='subtle'>
                        <IconBrandTwitter size={18} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon size='lg' color='gray' variant='subtle'>
                        <IconBrandYoutube size={18} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon size='lg' color='gray' variant='subtle'>
                        <IconBrandInstagram size={18} stroke={1.5} />
                    </ActionIcon>
                </Group>
            </Container>
        </footer>
    )
}
