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
} from "@/app/api/actions/CreateAppointment"
import { notifications } from "@mantine/notifications"
import {
    GetDoctorAppointments,
    HandleDoctorAppointmentAction,
} from "@/app/api/actions/DoctorAppointments"

// React Big Calendar requires a localizer (Moment.js here)
const localizer = momentLocalizer(moment)

// Extend the calendar event to carry full appointment info
interface CalendarEvent extends Event {
    id: number
    doctorId: number
    name: string
    gender: string
    description: string
    appointmentDate: Date
    time: string
    start: Date
    end: Date
    status: string
    duration: number
}

const DoctorAppointmentsCalendar: React.FC = () => {
    const { data: session } = useSession()
    const [appointments, setAppointments] = useState<CalendarEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (!session) return
        const fetchAppointments = async () => {
            try {
                const data = await GetDoctorAppointments(session.backendToken)
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
                name: appointment.name,
                title: `Patient: ${appointment.name}`,
                start: appointment.start,
                end: appointment.end,
                status: appointment.status,
                duration: appointment.duration,
                appointmentDate: appointment.appointmentDate,
                time: appointment.time,
                gender: appointment.gender,
                description: appointment.description,
            }
        })
    }, [appointments])

    const handleSelectEvent = (event: CalendarEvent) => {
        console.log("Selected event:", event)
        setSelectedAppointment(event)
        openModal()
    }

    const handleActionAppointment = async (
        action: "accepted" | "rejected" | "cancelled"
    ) => {
        if (!selectedAppointment) return
        // Here you would make an API call to cancel
        console.log(`${action} appointment with ID: ${selectedAppointment.id}`)

        try {
            const updated = await HandleDoctorAppointmentAction(
                selectedAppointment.id,
                session?.backendToken || "",
                action
            )
            console.log("Updated appointment:", updated)
        } catch (error) {
            console.error("Error updating appointment status:", error)
            notifications.show({
                title: "Error",
                message: "Failed to update appointment status.",
                color: "red",
            })
            return
        }

        setAppointments((prev) =>
            prev.map((app) =>
                app.id === selectedAppointment.id
                    ? { ...app, status: action }
                    : app
            )
        )

        closeModal()
        setSelectedAppointment(null)
        notifications.show({
            title: `Appointment ${action}`,
            message: `Your appointment has been successfully ${action}.`,
            color: "teal",
        })
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
                    eventPropGetter={(event) => {
                        let backgroundColor = "#3174ad" // default

                        if (event.status === "accepted") {
                            backgroundColor = "#1ca0d4" // bluish
                        } else if (event.status === "pending") {
                            backgroundColor = "#f19339" // yellow
                        } else if (event.status === "rejected") {
                            backgroundColor = "#dc3545" // red
                        } else if (event.status === "cancelled") {
                            backgroundColor = "#6c757d" // gray
                        }

                        return {
                            style: {
                                backgroundColor,
                                color: "white",
                                borderRadius: "5px",
                                padding: "4px",
                            },
                        }
                    }}
                />
            </div>

            {/* Modal for Selected Appointment */}
            <Modal
                opened={modalOpened}
                onClose={closeModal}
                title={selectedAppointment?.name || "Appointment Details"}
            >
                {selectedAppointment && (
                    <Stack gap='sm'>
                        <Text>
                            <strong>Patient:</strong> {selectedAppointment.name}
                        </Text>
                        <Text>
                            <strong>Time:</strong>{" "}
                            {moment(selectedAppointment.start).format("LLL")} -{" "}
                            {moment(selectedAppointment.end).format("LT")}
                        </Text>
                        <Text>
                            <strong>Description:</strong>{" "}
                            {selectedAppointment.description}
                        </Text>
                        <Text>
                            <strong>Status:</strong>{" "}
                            {selectedAppointment.status}
                        </Text>
                        <Group>
                            <Button
                                onClick={() =>
                                    handleActionAppointment("accepted")
                                }
                                mt='md'
                            >
                                Accept
                            </Button>
                            <Button
                                color='red'
                                onClick={() =>
                                    handleActionAppointment("rejected")
                                }
                                mt='md'
                            >
                                Reject
                            </Button>
                            <Button
                                color='gray'
                                onClick={() =>
                                    handleActionAppointment("cancelled")
                                }
                                mt='md'
                            >
                                Cancel Appointment
                            </Button>
                        </Group>
                    </Stack>
                )}
            </Modal>
        </Box>
    )
}

export default DoctorAppointmentsCalendar
