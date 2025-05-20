"use client"
import {
    TextInput,
    Select,
    Textarea,
    Modal,
    Button,
    Stepper,
    Group,
    Loader,
    Stack,
    Title,
    Text,
    Paper,
} from "@mantine/core"
import { useEffect, useState } from "react"
import { useForm } from "@mantine/form"
import { DatePickerInput, getTimeRange, TimeGrid } from "@mantine/dates"
import { useSession } from "next-auth/react"
import {
    CreateAppointment,
    GetUnavailableTimes,
} from "@/app/actions/CreateAppointment"
import { notifications } from "@mantine/notifications"

interface BookAppointmentProps {
    opened: boolean
    close: () => void
    schedule: Schedule | null
}

function BookAppointment({ opened, close, schedule }: BookAppointmentProps) {
    const [active, setActive] = useState(0)
    const { data: session } = useSession()

    const today = new Date()
    const maxMonth = new Date()
    maxMonth.setMonth(today.getMonth() + 2)

    const form = useForm({
        initialValues: {
            name: "",
            gender: "",
            description: "",
            appointmentDate: null as Date | null,
            time: null as string | null, // Explicitly string or null if TimeGrid provides strings
        },
        validate: {
            name: (value) =>
                value.trim().length > 0 ? null : "Name is required",
            gender: (value) => (value ? null : "Gender is required"),
            description: () => null,
            appointmentDate: (value) => (value ? null : "Date is required"),
            time: (value) => {
                return value ? null : "Time is required" // Or `value && String(value).trim() !== ""` for stricter check
            },
        },
    })

    const [loadingTimes, setLoadingTimes] = useState(false)
    const [availableTimes, setAvailableTimes] = useState<string[]>([])

    useEffect(() => {
        if (form.values.appointmentDate) {
            setLoadingTimes(true)
            const fetchUnavailableTimes = async () => {
                const times = await GetUnavailableTimes(
                    form.values.appointmentDate,
                    schedule?.doctorId,
                    session?.backendToken || ""
                )
                setAvailableTimes(times)
                setLoadingTimes(false)
            }
            fetchUnavailableTimes()
        }
    }, [form.values.appointmentDate, schedule?.doctorId, session?.backendToken])

    const nextStep = () => {
        const fieldsToValidate =
            active === 0
                ? ["name", "gender", "description"]
                : ["appointmentDate", "time"]

        let currentStepIsValid = true
        for (const field of fieldsToValidate) {
            const isFieldValid = form.validateField(field) // validateField updates form.errors

            if (isFieldValid.hasError) {
                currentStepIsValid = false
            }
        }

        if (currentStepIsValid) {
            setActive((current) => current + 1)
        }
    }

    const prevStep = () => {
        setActive((current) => (current > 0 ? current - 1 : current))
    }

    const handleSubmit = async (values: typeof form.values) => {
        console.log("Final submitted values", values)
        const formData = {
            doctorId: schedule!.doctorId,
            duration: schedule!.duration,
            price: schedule!.price,
            ...values,
        }
        try {
            const res = await CreateAppointment(
                formData,
                session?.backendToken || ""
            )
            notifications.show({
                title: "Success",
                message: "Appointment created successfully!",
                color: "green",
            })
            close()
            setActive(0)
            form.reset()
        } catch (error) {
            console.error("Error creating appointment:", error)
            notifications.show({
                title: "Error",
                message: "Failed to create appointment. Please try again.",
                color: "red",
            })
        }
    }

    const minutesToHHMM = (minutes: number): string => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
            2,
            "0"
        )}`
    }

    const Detail = ({ label, value }: { label: string; value: string }) => (
        <Group justify='space-between'>
            <Text fw={500}>{label}:</Text>
            <Text>{value}</Text>
        </Group>
    )

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => {
                    close()
                    setActive(0)
                    form.reset()
                }}
                title='Book an appointment'
                centered
                size='lg'
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stepper active={active} onStepClick={setActive}>
                        <Stepper.Step
                            label='Personal Info'
                            description='Basic details'
                            allowStepSelect={active > 0}
                        >
                            <TextInput
                                label='Name'
                                placeholder='Your name'
                                withAsterisk
                                {...form.getInputProps("name")}
                                mb='sm'
                                mt='md' // Added margin top for better spacing in modal
                            />
                            <Select
                                label='Gender'
                                placeholder='Gender'
                                data={["Male", "Female"]}
                                withAsterisk
                                {...form.getInputProps("gender")}
                                mb='sm'
                                searchable
                            />
                            <Textarea
                                label='Description'
                                placeholder='Briefly describe the reason for your appointment (optional)'
                                {...form.getInputProps("description")}
                                mb='md' // Added margin bottom for spacing before next step's content or buttons
                            />
                        </Stepper.Step>

                        <Stepper.Step
                            label='Date & Time'
                            description='Pick an appointment slot'
                            allowStepSelect={active > 1}
                        >
                            <DatePickerInput
                                valueFormat='YYYY MMM DD'
                                label='Pick a date'
                                placeholder='Pick date'
                                withAsterisk
                                clearable
                                {...form.getInputProps("appointmentDate")}
                                minDate={today} // Use the calculated today
                                maxDate={maxMonth}
                                mb='md'
                                mt='md'
                                excludeDate={(date) => {
                                    const d = new Date(date)
                                    return !schedule?.workingDays.includes(
                                        d.getDay() + 1
                                    )
                                }}
                                firstDayOfWeek={0}
                            />

                            {form.values.appointmentDate && !loadingTimes && (
                                <TimeGrid
                                    data={getTimeRange({
                                        startTime: schedule?.from || "8:00",
                                        endTime: schedule?.to || "17:00",
                                        interval: minutesToHHMM(
                                            schedule?.duration || 30
                                        ),
                                    })}
                                    allowDeselect
                                    disabled={!form.values.appointmentDate}
                                    disableTime={availableTimes}
                                    {...form.getInputProps("time")}
                                />
                            )}
                            {loadingTimes && <Loader size='sm' mt='sm' />}
                        </Stepper.Step>
                        <Stepper.Step
                            label='Payment'
                            description='Payment details'
                            allowStepSelect={active > 2}
                        >
                            <Stack justify='center' align='center'>
                                <Title order={3}>Payment Details</Title>
                                <Text c='dimmed'>
                                    Payment details will be handled here.
                                </Text>
                                <Text c='dimmed'>
                                    Total Price: ${schedule?.price}
                                </Text>
                            </Stack>
                        </Stepper.Step>

                        <Stepper.Completed>
                            <Stack justify='center' mt='xl' mb='md' gap='md'>
                                <Title order={3}>You're ready to book!</Title>
                                <Text c='dimmed'>
                                    Review your details and click{" "}
                                    <strong>"Create"</strong> to finish.
                                </Text>

                                <Paper
                                    shadow='sm'
                                    p='md'
                                    radius='md'
                                    withBorder
                                >
                                    <Stack gap='sm'>
                                        <Detail
                                            label='Name'
                                            value={form.values.name}
                                        />
                                        <Detail
                                            label='Gender'
                                            value={form.values.gender}
                                        />
                                        <Detail
                                            label='Date'
                                            value={
                                                form.values.appointmentDate
                                                    ? new Date(
                                                          form.values.appointmentDate
                                                      ).toLocaleDateString()
                                                    : "Not selected"
                                            }
                                        />

                                        <Detail
                                            label='Time'
                                            value={
                                                form.values.time ||
                                                "Not selected"
                                            }
                                        />
                                        <Detail
                                            label='Price'
                                            value={
                                                `$ ${schedule?.price.toString()}` ||
                                                "Not selected"
                                            }
                                        />
                                        <Detail
                                            label='Description'
                                            value={
                                                form.values.description ||
                                                "None"
                                            }
                                        />
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Stepper.Completed>
                    </Stepper>

                    <Group justify='center' mt='xl'>
                        {active > 0 && (
                            <Button variant='default' onClick={prevStep}>
                                Back
                            </Button>
                        )}
                        {active <= 3 ? (
                            <Button onClick={nextStep}>
                                {active == 3 ? "Create" : "Next Step"}
                            </Button>
                        ) : (
                            <Button type='submit'>Create</Button>
                        )}
                    </Group>
                </form>
            </Modal>
        </>
    )
}

export default BookAppointment
