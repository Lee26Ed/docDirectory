"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Calendar,
    momentLocalizer,
    Event,
    NavigateAction,
} from "react-big-calendar"
import moment from "moment"
import { Modal, Button, Text, Group, Box, Title, Stack } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useRouter } from "next/navigation"
import { IconArrowRight } from "@tabler/icons-react"

// Configure react-big-calendar with moment
const localizer = momentLocalizer(moment)

// Define a type for your appointment data
interface Appointment {
    id: number
    title: string
    start: Date
    end: Date
    // Add any other relevant appointment details
    doctorId: number
    doctorName: string
}

// Extend the react-big-calendar Event type to include our appointment details
interface CalendarEvent extends Event {
    id: number
    doctorId: number
    doctorName: string
    // Add any other relevant details from your Appointment type
}

const UserAppointmentsCalendar: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [selectedAppointment, setSelectedAppointment] =
        useState<Appointment | null>(null)
    const [modalOpened, { open: openModal, close: closeModal }] =
        useDisclosure(false)
    const [loading, setLoading] = useState(true)
    // --- Add state for the current date displayed by the calendar ---
    const [currentDate, setCurrentDate] = useState(new Date())
    // -------------------------------------------------------------
    const router = useRouter()

    // --- Data Fetching (Replace with your actual API call) ---
    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true)
            // In a real app, you would fetch data from your backend here
            // You might need to fetch appointments based on the *currently displayed date range*
            // if you have a very large number of appointments. For simplicity here,
            // we'll just fetch all dummy appointments.
            const dummyAppointments: Appointment[] = [
                {
                    id: 1,
                    title: "Dr. Smith Appointment",
                    start: new Date(2025, 4, 20, 10, 0), // May 20th, 2025, 10:00 AM
                    end: new Date(2025, 4, 20, 11, 0), // May 20th, 2025, 11:00 AM
                    doctorId: 101,
                    doctorName: "Dr. Jane Smith",
                },
                {
                    id: 2,
                    title: "Dr. Jones Follow-up",
                    start: new Date(2025, 4, 22, 14, 30), // May 22nd, 2025, 2:30 PM
                    end: new Date(2025, 4, 22, 15, 0), // May 22nd, 2025, 3:00 PM
                    doctorId: 102,
                    doctorName: "Dr. John Jones",
                },
                {
                    id: 3,
                    title: "Dr. Green Checkup",
                    start: new Date(2025, 5, 10, 9, 0), // June 10th, 2025, 9:00 AM (Example in another month)
                    end: new Date(2025, 5, 10, 9, 45),
                    doctorId: 103,
                    doctorName: "Dr. Lisa Green",
                },
            ]
            // Simulate a network delay
            await new Promise((resolve) => setTimeout(resolve, 500))
            setAppointments(dummyAppointments)
            setLoading(false)
        }

        fetchAppointments()
        // Dependency array is empty, runs once on mount.
        // If you implement fetching based on currentDate, add currentDate here.
    }, [])

    // --- Format appointments for react-big-calendar ---
    const events: CalendarEvent[] = useMemo(() => {
        return appointments.map((appointment) => ({
            ...appointment,
            title: appointment.title,
            start: new Date(appointment.start),
            end: new Date(appointment.end),
        }))
    }, [appointments])

    // --- Handle Appointment Click ---
    const handleSelectEvent = (event: CalendarEvent) => {
        // Find the original appointment data
        const originalAppointment = appointments.find(
            (app) => app.id === event.id
        )
        if (originalAppointment) {
            setSelectedAppointment(originalAppointment)
            openModal()
        }
    }

    // --- Handle Cancel Appointment ---
    const handleCancelAppointment = async () => {
        if (!selectedAppointment) return

        console.log(
            `Attempting to cancel appointment with ID: ${selectedAppointment.id}`
        )
        // In a real app, you would make an API call here to cancel the appointment
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Update the state to remove the cancelled appointment
        setAppointments(
            appointments.filter((app) => app.id !== selectedAppointment.id)
        )

        // Close the modal
        closeModal()
        setSelectedAppointment(null)
        console.log(`Appointment ${selectedAppointment.id} cancelled.`)
    }

    // --- Handle Redirect to Doctors List ---
    const handleRedirectToDoctors = () => {
        router.push("/doctors")
    }

    // --- Handle calendar navigation ---
    const handleNavigate = (
        newDate: Date,
        view: string,
        action: NavigateAction
    ) => {
        // react-big-calendar passes the new date and the current view/action
        setCurrentDate(newDate)
        // If you fetch data based on the visible date range, you would call
        // your fetchAppointments function here, potentially passing the newDate
        // or the start/end dates of the new view.
        // fetchAppointments(newDate); // Example if fetchAppointments took a date
    }
    // -----------------------------------

    if (loading) {
        return <Text>Loading appointments...</Text>
    }

    return (
        <Box p='md'>
            <Group justify='space-between' mb='md'>
                <Title order={2} mb='md'>
                    Your Appointments
                </Title>
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
                    // --- Add date and onNavigate props ---
                    date={currentDate} // Tell the calendar which date to display
                    onNavigate={handleNavigate} // Update state when navigation buttons are clicked
                    // ------------------------------------
                />
            </div>

            {/* Mantine Modal for Appointment Details */}
            <Modal
                opened={modalOpened}
                onClose={closeModal}
                // Pass a string title to avoid heading nesting issues
                title={selectedAppointment?.title || "Appointment Details"}
            >
                {selectedAppointment && (
                    <Stack gap='sm'>
                        <Text>
                            <strong>Doctor:</strong>{" "}
                            {selectedAppointment.doctorName}
                        </Text>
                        <Text>
                            <strong>Time:</strong>{" "}
                            {moment(selectedAppointment.start).format("LLL")} -{" "}
                            {moment(selectedAppointment.end).format("LT")}
                        </Text>
                        {/* Add more details if needed */}
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
