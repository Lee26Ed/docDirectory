"use client"
import { useState } from "react"
import {
    IconCalendarClock,
    IconDashboard,
    IconHistory,
    IconLogout,
    IconStar,
    IconStethoscope,
    IconSwitchHorizontal,
    IconTrash,
    IconUserCog,
} from "@tabler/icons-react"
import { Avatar, Code, Group } from "@mantine/core"
import classes from "./sidebar.module.css"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

const data = [
    // { link: "", label: "Dashboard", icon: IconDashboard },
    { link: "", label: "Appointments", icon: IconStethoscope },
    { link: "", label: "Review A Doctor", icon: IconStar },
]

export interface SideBarProps {
    active: string
    setActive: (active: string) => void
}

export function SideBar({ active, setActive }: SideBarProps) {
    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault()
                setActive(item.label)
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ))

    const name = "John Doe"

    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                <Group className={classes.header} justify='space-between'>
                    {/* <Avatar name={name} color='dark' /> */}
                    <Link href='/'>
                        <Image
                            src={"/favicon.svg"}
                            alt='Logo'
                            width={50}
                            height={50}
                        />
                    </Link>
                    <Code fw={700} className={classes.version}>
                        v1.0.5
                    </Code>
                </Group>
                {links}
            </div>

            <div className={classes.footer}>
                <a
                    href='#'
                    className={classes.link}
                    onClick={(event) => event.preventDefault()}
                >
                    <IconTrash className={classes.linkIcon} stroke={1.5} />
                    <span>Delete Account</span>
                </a>

                <a
                    href='#'
                    className={classes.link}
                    onClick={(event) => {
                        event.preventDefault()
                        signOut({ callbackUrl: "/" })
                    }}
                >
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                </a>
            </div>
        </nav>
    )
}
