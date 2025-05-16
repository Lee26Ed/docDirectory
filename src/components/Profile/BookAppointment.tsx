"use client"
import {
    TextInput,
    Select,
    Textarea,
    Modal,
    Button,
    Stepper,
    Group,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useState } from "react"
import { useForm } from "@mantine/form"
import { DatePickerInput, getTimeRange, TimeGrid } from "@mantine/dates"

function BookAppointment() {
    const [opened, { open, close }] = useDisclosure(false)
    const [active, setActive] = useState(0)

    const today = new Date()
    const maxMonth = new Date()
    maxMonth.setMonth(today.getMonth() + 2)

    const form = useForm({
        initialValues: {
            name: "",
            gender: "",
            description: "",
            date: null as Date | null,
            time: null as string | null, // Explicitly string or null if TimeGrid provides strings
        },
        validate: {
            name: (value) =>
                value.trim().length > 0 ? null : "Name is required",
            gender: (value) => (value ? null : "Gender is required"),
            description: () => null,
            date: (value) => (value ? null : "Date is required"),
            time: (value) => {
                return value ? null : "Time is required" // Or `value && String(value).trim() !== ""` for stricter check
            },
        },
    })

    const nextStep = () => {
        const fieldsToValidate =
            active === 0 ? ["name", "gender", "description"] : ["date", "time"]

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

    const handleSubmit = (values: typeof form.values) => {
        console.log("Final submitted values", values)
        close() // Close the modal
        setActive(0) // Reset to the first step
        form.reset() // Reset form fields and errors
    }

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
                                {...form.getInputProps("date")}
                                minDate={today} // Use the calculated today
                                maxDate={maxMonth}
                                mb='md'
                                mt='md' // Added margin top
                            />

                            <TimeGrid
                                data={getTimeRange({
                                    startTime: "09:30", // Adjusted startTime
                                    endTime: "11:45",
                                    interval: "00:15",
                                })}
                                allowDeselect
                                disabled={!form.values.date}
                                {...form.getInputProps("time")}
                            />
                        </Stepper.Step>

                        <Stepper.Completed>
                            <Group justify='center' mt='xl' mb='md'>
                                You're ready to book! Review your details and
                                click "Create" to finish.
                            </Group>
                        </Stepper.Completed>
                    </Stepper>

                    <Group justify='center' mt='xl'>
                        {active > 0 && (
                            <Button variant='default' onClick={prevStep}>
                                Back
                            </Button>
                        )}
                        {active <= 2 ? (
                            <Button onClick={nextStep}>
                                {active == 2
                                    ? "Create Appoitnment"
                                    : "Next Step"}
                            </Button>
                        ) : (
                            <Button type='submit'>Create Appointment</Button>
                        )}
                    </Group>
                </form>
            </Modal>

            <Button onClick={open}>Book an appointment</Button>
        </>
    )
}

export default BookAppointment
