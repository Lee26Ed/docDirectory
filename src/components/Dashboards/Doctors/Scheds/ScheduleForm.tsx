"use client"

import {
    Button,
    Center,
    Group,
    NumberInput,
    Select,
    Stack,
    Title,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { TimeInput as MantineTimeInput } from "@mantine/dates"
import { useSession } from "next-auth/react"
import { notifications } from "@mantine/notifications"
import { updateDoctorSchedule } from "@/app/actions/UpdateDoctorProfile"

const weekdays = [
    { short: "S", value: 0 },
    { short: "M", value: 1 },
    { short: "T", value: 2 },
    { short: "W", value: 3 },
    { short: "T", value: 4 },
    { short: "F", value: 5 },
    { short: "S", value: 6 },
]

const timeIntervals = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
]

export default function ScheduleSetup({
    schedule,
    refetch,
}: {
    schedule: Schedule | null
    refetch: () => void
}) {
    // get the current user from session
    const { data: session } = useSession()
    if (!session) {
        return <div>Loading...</div>
    }
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

    const form = useForm({
        mode: "controlled",
        initialValues: {
            workingDays: schedule?.workingDays || [],
            from: schedule?.from || "",
            to: schedule?.to || "",
            duration: String(schedule?.duration) || 30,
            downtime: schedule?.downtime || 0,
            price: schedule?.price || 0,
        },
        validate: {
            workingDays: (v) =>
                v.length > 0 ? null : "Select at least one working day",
            from: (v) => (v ? null : "Required"),
            to: (v) => (v ? null : "Required"),
        },
    })

    const toggleDay = (day: number) => {
        const { workingDays } = form.values
        form.setFieldValue(
            "workingDays",
            workingDays.includes(day)
                ? workingDays.filter((d) => d !== day)
                : [...workingDays, day]
        )
    }

    const handleSubmit = async (values: typeof form.values) => {
        const updatedPayload = {
            doctorId: session.user.doctorId!,
            ...values,
        }
        try {
            await updateDoctorSchedule(updatedPayload, session.backendToken)
            notifications.show({
                title: "Success",
                message: "Schedule updated successfully",
                color: "teal",
            })
            refetch()
            form.resetTouched()
        } catch (error) {
            console.error("Error updating schedule:", error)
            notifications.show({
                title: "Error",
                message: "Failed to update schedule",
                color: "red",
            })
        }
    }

    return (
        <Stack>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <div>
                        <Title order={5} mb='xs'>
                            Working Days
                        </Title>
                        <Group gap='sm' mb='xs' justify='center'>
                            {weekdays.map((day, index) => {
                                const isSelected =
                                    form.values.workingDays.includes(day.value)
                                return (
                                    <Button
                                        key={index}
                                        onClick={() => toggleDay(day.value)}
                                        radius='xl'
                                        size='sm'
                                        variant={
                                            isSelected ? "filled" : "outline"
                                        }
                                        color={isSelected ? "blue" : "gray"}
                                        style={{
                                            width: 30,
                                            height: 30,
                                            padding: 0,
                                            textAlign: "center",
                                        }}
                                        type='button'
                                    >
                                        {day.short}
                                    </Button>
                                )
                            })}
                        </Group>
                        {form.errors.workingDays && (
                            <div style={{ color: "red", fontSize: 12 }}>
                                {form.errors.workingDays}
                            </div>
                        )}
                    </div>

                    <Group grow>
                        <MantineTimeInput
                            label='From'
                            placeholder='Start time'
                            {...form.getInputProps("from")}
                        />
                        <MantineTimeInput
                            label='To'
                            placeholder='End time'
                            {...form.getInputProps("to")}
                        />
                    </Group>

                    <Select
                        label='Time Interval per Appointment'
                        data={timeIntervals}
                        {...form.getInputProps("duration")}
                    />

                    <NumberInput
                        label='Downtime between Appointments (minutes)'
                        min={0}
                        step={5}
                        {...form.getInputProps("downtime")}
                    />

                    <NumberInput
                        label='Price per Appointment ($)'
                        min={0}
                        decimalScale={2}
                        step={5}
                        {...form.getInputProps("price")}
                    />

                    {form.isTouched() && (
                        <>
                            <Button
                                fullWidth
                                mt='sm'
                                type='submit'
                                color='teal'
                                variant='outline'
                            >
                                Update Schedule
                            </Button>
                            <Button
                                fullWidth
                                mt='sm'
                                color='gray'
                                variant='outline'
                                onClick={form.reset}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </Stack>
            </form>
        </Stack>
    )
}
