import {
    ColorSchemeScript,
    MantineProvider,
    mantineHtmlProps,
} from "@mantine/core"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
// import "@mantine/core/styles.css"
import "@mantine/core/styles.layer.css"
import "mantine-datatable/styles.layer.css"
import "@mantine/notifications/styles.css"
import "@mantine/dates/styles.css"
import "@mantine/dropzone/styles.css"
import { Notifications } from "@mantine/notifications"
import SessionProviderWrapper from "@/components/auth/SessionProviderWrapper"
import "react-big-calendar/lib/css/react-big-calendar.css"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "MediApp",
    description: "MediApp - Your Health, Our Priority",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en' {...mantineHtmlProps}>
            <head>
                <ColorSchemeScript />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                <SessionProviderWrapper>
                    <MantineProvider>
                        <Notifications />
                        {children}
                    </MantineProvider>
                </SessionProviderWrapper>
            </body>
        </html>
    )
}
