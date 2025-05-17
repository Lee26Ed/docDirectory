"use client"

import {
    Box,
    Button,
    Center,
    Container,
    Group,
    NumberInput,
    Paper,
    Select,
    Stack,
    Title,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { TimeInput as MantineTimeInput } from "@mantine/dates"

const weekdays = [
    { short: "S", value: "0" },
    { short: "M", value: "1" },
    { short: "T", value: "2" },
    { short: "W", value: "3" },
    { short: "T", value: "4" },
    { short: "F", value: "5" },
    { short: "S", value: "6" },
]

const timeIntervals = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "45", label: "45 minutes" },
    { value: "60", label: "1 hour" },
]

export default function ScheduleSetup() {
    // TODO: Check if doctor has a schedule already
    const schedule = null

    const form = useForm({
        initialValues: {
            workingDays: [] as string[],
            fromTime: "",
            toTime: "",
            interval: "30",
            downtime: 0,
            price: 0,
        },
        validate: {
            workingDays: (v) =>
                v.length > 0 ? null : "Select at least one working day",
            fromTime: (v) => (v ? null : "Required"),
            toTime: (v) => (v ? null : "Required"),
        },
    })

    const toggleDay = (day: string) => {
        const { workingDays } = form.values
        form.setFieldValue(
            "workingDays",
            workingDays.includes(day)
                ? workingDays.filter((d) => d !== day)
                : [...workingDays, day]
        )
    }

    const handleSubmit = (values: typeof form.values) => {
        console.log("Submitted schedule:", values)
        // TODO: POST to your backend API here
    }

    return (
        <Center mt={50}>
            <Paper miw={600} shadow='xl' withBorder pb={50} p={30} radius='md'>
                <Title order={3} mb='md'>
                    Set Your Availability
                </Title>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <div>
                            <Title order={5} mb='xs'>
                                Working Days
                            </Title>
                            <Group gap='sm' mb='xs' justify='center'>
                                {weekdays.map((day, index) => {
                                    const isSelected =
                                        form.values.workingDays.includes(
                                            day.value
                                        )
                                    return (
                                        <Button
                                            key={index}
                                            onClick={() => toggleDay(day.value)}
                                            radius='xl'
                                            size='sm'
                                            variant={
                                                isSelected
                                                    ? "filled"
                                                    : "outline"
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
                                {...form.getInputProps("fromTime")}
                            />
                            <MantineTimeInput
                                label='To'
                                placeholder='End time'
                                {...form.getInputProps("toTime")}
                            />
                        </Group>

                        <Select
                            label='Time Interval per Appointment'
                            data={timeIntervals}
                            {...form.getInputProps("interval")}
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

                        <Button type='submit' mt='sm' fullWidth>
                            Save Schedule
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Center>
    )
}
