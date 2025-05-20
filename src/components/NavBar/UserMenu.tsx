"use client"
import { Menu, Button, Text, Avatar } from "@mantine/core"
import {
    IconSettings,
    IconSearch,
    IconPhoto,
    IconMessageCircle,
    IconTrash,
    IconArrowsLeftRight,
    IconUser,
    IconLogout,
    IconDashboard,
} from "@tabler/icons-react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Session } from "next-auth"

type UserProps = {
    user: Session["user"]
}

const UserMenu = ({ user }: UserProps) => {
    const router = useRouter()

    const handleDashboardClick = () => {
        if (user.role === "admin") {
            router.push("/admin/dashboard")
        }
        if (user.role === "patient") {
            router.push(`/profiles/user/${user.id}`)
        }
        if (user.role === "doctor") {
            router.push(`/profiles/doctor/${user.id}`)
        }
    }
    return (
        <Menu shadow='md' width={200}>
            <Menu.Target>
                <Avatar name={user.name} color='initials' />
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item
                    leftSection={<IconDashboard size={14} />}
                    onClick={handleDashboardClick}
                >
                    {user.role === "admin" ? "Admin Dashboard" : "Appointments"}
                </Menu.Item>
                <Menu.Item leftSection={<IconMessageCircle size={14} />}>
                    Messages
                </Menu.Item>
                <Menu.Item
                    leftSection={<IconLogout size={14} />}
                    onClick={() => signOut()}
                >
                    Log out
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item color='red' leftSection={<IconTrash size={14} />}>
                    Delete my account
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}

export default UserMenu
