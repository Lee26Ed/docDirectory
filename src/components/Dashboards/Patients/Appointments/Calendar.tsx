"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Calendar,
    momentLocalizer,
    Event,
    NavigateAction,
} from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Modal, Button, Text, Group, Box, Title, Stack } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useRouter } from "next/navigation"
import { IconArrowRight } from "@tabler/icons-react"
import useFetch from "@/hooks/useFetch"
import { useSession } from "next-auth/react"
import {
    CancelUserAppointment,
    GetUserAppointments,
} from "@/app/actions/CreateAppointment"
import { notifications } from "@mantine/notifications"

// React Big Calendar requires a localizer (Moment.js here)
const localizer = momentLocalizer(moment)

// Extend the calendar event to carry full appointment info
interface CalendarEvent extends Event {
    id: number
    doctorId: number
    fullName: string
    start: Date
    end: Date
    status: string
    duration: number
}

const UserAppointmentsCalendar: React.FC = () => {
    const { data: session } = useSession()
    const [appointments, setAppointments] = useState<CalendarEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (!session) return
        const fetchAppointments = async () => {
            try {
                const data = await GetUserAppointments(session.backendToken)
                setAppointments(data)
            } catch (err: any) {
                setError(err.message || "Something went wrong")
            } finally {
                setLoading(false)
            }
        }
        fetchAppointments()
    }, [session])

    const [selectedAppointment, setSelectedAppointment] =
        useState<CalendarEvent | null>(null)
    const [modalOpened, { open: openModal, close: closeModal }] =
        useDisclosure(false)
    const [currentDate, setCurrentDate] = useState(new Date())

    // --- Format appointments into calendar events ---
    const events: CalendarEvent[] = useMemo(() => {
        return appointments.map((appointment) => {
            return {
                id: appointment.id,
                doctorId: appointment.doctorId,
                fullName: appointment.fullName,
                title: appointment.fullName,
                start: appointment.start,
                end: appointment.end,
                status: appointment.status,
                duration: appointment.duration,
            }
        })
    }, [appointments])

    const handleSelectEvent = (event: CalendarEvent) => {
        console.log("Selected event:", event)
        setSelectedAppointment(event)
        openModal()
    }

    const handleCancelAppointment = async () => {
        if (!selectedAppointment) return
        // Here you would make an API call to cancel
        console.log(`Cancelling appointment with ID: ${selectedAppointment.id}`)

        await CancelUserAppointment(
            selectedAppointment.id,
            session?.backendToken || ""
        )

        setAppointments((prev) =>
            prev.filter((app) => app.id !== selectedAppointment.id)
        )
        closeModal()
        setSelectedAppointment(null)
        notifications.show({
            title: "Appointment Cancelled",
            message: "Your appointment has been successfully cancelled.",
            color: "teal",
        })
    }

    const handleRedirectToDoctors = () => {
        router.push("/")
    }

    const handleNavigate = (
        newDate: Date,
        view: string,
        action: NavigateAction
    ) => {
        setCurrentDate(newDate)
    }

    if (loading) {
        return <Text>Loading appointments...</Text>
    }

    return (
        <Box p='md'>
            <Group justify='space-between' mb='md'>
                <Title order={2}>Your Appointments</Title>
                <Button
                    onClick={handleRedirectToDoctors}
                    rightSection={<IconArrowRight size={14} />}
                >
                    Find a Doctor and Book an Appointment
                </Button>
            </Group>

            {/* Calendar Component */}
            <div style={{ height: "600px" }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor='start'
                    endAccessor='end'
                    onSelectEvent={handleSelectEvent}
                    style={{ height: "100%" }}
                    date={currentDate}
                    onNavigate={handleNavigate}
                />
            </div>

            {/* Modal for Selected Appointment */}
            <Modal
                opened={modalOpened}
                onClose={closeModal}
                title={selectedAppointment?.title || "Appointment Details"}
            >
                {selectedAppointment && (
                    <Stack gap='sm'>
                        <Text>
                            <strong>Doctor:</strong>{" "}
                            {selectedAppointment.fullName}
                        </Text>
                        <Text>
                            <strong>Time:</strong>{" "}
                            {moment(selectedAppointment.start).format("LLL")} –{" "}
                            {moment(selectedAppointment.end).format("LT")}
                        </Text>
                        <Text>
                            <strong>Status:</strong>{" "}
                            {selectedAppointment.status}
                        </Text>
                        <Button
                            color='red'
                            onClick={handleCancelAppointment}
                            fullWidth
                            mt='md'
                        >
                            Cancel Appointment
                        </Button>
                    </Stack>
                )}
            </Modal>
        </Box>
    )
}

export default UserAppointmentsCalendar
