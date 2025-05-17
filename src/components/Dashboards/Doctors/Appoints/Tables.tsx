"use client"
import { DataTable } from "mantine-datatable"
import { ActionIcon, Box, Group } from "@mantine/core"
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

interface Appointment {
    appointmentId: number
    doctorId: number
    name: string
    gender: string
    description: string
    appointmentDate: Date
    time: string
    status: string
    duration: number
    createdAt: string
}

const Tables = () => {
    const { data: session } = useSession()

    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

    const [records, setRecords] = useState<any[]>([])
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await fetch(
                    `${BACKEND_API_URL}/api/v1/appointments`,
                    {
                        headers: {
                            Authorization: `Bearer ${
                                session?.backendToken || ""
                            }`,
                        },
                    }
                )

                if (!res.ok) throw new Error("Failed to fetch records")

                const json: {
                    status: string
                    data: {
                        appointmentData: Appointment[]
                    }
                } = await res.json()

                console.log(json)

                const preparedRecords = json.data.appointmentData.map(
                    (record) => ({
                        id: record.appointmentId,
                        "Appointment ID": record.appointmentId,
                        "Patient Name": record.name,
                        Date: new Date(
                            record.appointmentDate
                        ).toLocaleDateString(),
                        Time: record.time,
                        actions: record,
                        status: record.status,
                        description: record.description,
                    })
                )
                setRecords(preparedRecords)
            } catch (error) {
                console.error(error)
                setRecords([])
            }
        }

        fetchRecords()
    }, [BACKEND_API_URL, session?.backendToken])

    return (
        <DataTable
            highlightOnHover
            withRowBorders
            withTableBorder
            borderRadius={"md"}
            columns={[
                { accessor: "Appointment ID" },
                { accessor: "Patient Name" },
                { accessor: "Date" },
                { accessor: "Time" },
                { accessor: "status" },
                { accessor: "description" },
                {
                    accessor: "actions",
                    title: <Box mr={6}>Row actions</Box>,
                    textAlign: "right",
                    render: (company) => (
                        <Group gap={4} justify='right' wrap='nowrap'>
                            <ActionIcon
                                size='sm'
                                variant='subtle'
                                color='green'
                                onClick={() =>
                                    // showModal({ company, action: "view" })
                                    console.log("View", company)
                                }
                            >
                                <IconEye size={16} />
                            </ActionIcon>
                            <ActionIcon
                                size='sm'
                                variant='subtle'
                                color='blue'
                                onClick={() =>
                                    // showModal({ company, action: "edit" })
                                    console.log("Edit", company)
                                }
                            >
                                <IconEdit size={16} />
                            </ActionIcon>
                            <ActionIcon
                                size='sm'
                                variant='subtle'
                                color='red'
                                onClick={() =>
                                    // showModal({ company, action: "delete" })
                                    console.log("Delete", company)
                                }
                            >
                                <IconTrash size={16} />
                            </ActionIcon>
                        </Group>
                    ),
                },
            ]}
            records={records}
        />
    )
}

export default Tables
