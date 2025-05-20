"use client"

import useFetch from "@/hooks/useFetch"
import {
    Box,
    Card,
    Group,
    Stack,
    Text,
    Badge,
    Divider,
    Center,
    Grid,
    ThemeIcon,
    GridCol,
} from "@mantine/core"
import { IconClock, IconMoneybag, IconCalendarTime } from "@tabler/icons-react"
import { useSession } from "next-auth/react"

const daysMap = [
    { short: "S", value: 0 },
    { short: "M", value: 1 },
    { short: "T", value: 2 },
    { short: "W", value: 3 },
    { short: "T", value: 4 },
    { short: "F", value: 5 },
    { short: "S", value: 6 },
]

export default function ScheduleViewer() {
    // get the current user from session
    const { data: session } = useSession()
    if (!session) {
        return <div>Loading...</div>
    }
    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

    // get the doctor's schedule data from the backend
    const {
        data: schedule,
        loading,
        error,
        refetch,
    } = useFetch<Schedule>({
        url: `${BACKEND_API_URL}/api/v1/schedule`,
        config: {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.backendToken}`,
            },
        },
    })
    console.log("Schedule data:", schedule)
    if (loading) return <div>Loading...</div>
    if (error) return <div>Error loading schedule.</div>
    if (!schedule) {
        return (
            <div>
                <h2>Schedule</h2>
                <p>No schedule found.</p>
                <p>Please set up your schedule.</p>
            </div>
        )
    }
    return (
        <Box maw={700} mx='auto'>
            <Card padding='lg' radius='md' withBorder>
                <Stack gap='sm'>
                    <div>
                        <Text fw={400} size='sm' mb='xs'>
                            Working Days
                        </Text>
                        <Group gap='sm'>
                            {daysMap.map((day, index) => {
                                const isSelected =
                                    schedule.workingDays.includes(day.value)
                                return (
                                    <Badge
                                        key={index}
                                        size='lg'
                                        color={isSelected ? "blue" : "gray"}
                                        variant={
                                            isSelected ? "filled" : "outline"
                                        }
                                        style={{
                                            width: 40,
                                            textAlign: "center",
                                        }}
                                    >
                                        {day.short}
                                    </Badge>
                                )
                            })}
                        </Group>
                    </div>

                    <Divider />

                    <Grid>
                        <Grid.Col span={6}>
                            <Center inline>
                                <ThemeIcon variant='light' color='blue' mr='xs'>
                                    <IconClock size={16} />
                                </ThemeIcon>
                                <Text size='sm'>From: {schedule.from}</Text>
                            </Center>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Center inline>
                                <ThemeIcon variant='light' color='blue' mr='xs'>
                                    <IconClock size={16} />
                                </ThemeIcon>
                                <Text size='sm'>To: {schedule.to}</Text>
                            </Center>
                        </Grid.Col>
                    </Grid>

                    <Grid>
                        <Grid.Col span={6}>
                            <Center inline>
                                <ThemeIcon variant='light' color='teal' mr='xs'>
                                    <IconCalendarTime size={16} />
                                </ThemeIcon>
                                <Text size='sm'>
                                    Interval: {schedule.duration} min
                                </Text>
                            </Center>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Center inline>
                                <ThemeIcon
                                    variant='light'
                                    color='yellow'
                                    mr='xs'
                                >
                                    <IconClock size={16} />
                                </ThemeIcon>
                                <Text size='sm'>
                                    Downtime: {schedule.downtime} min
                                </Text>
                            </Center>
                        </Grid.Col>
                        <GridCol span={6}>
                            <Center inline>
                                <ThemeIcon
                                    variant='light'
                                    color='green'
                                    mr='xs'
                                >
                                    <IconMoneybag size={16} />
                                </ThemeIcon>
                                <Text size='sm'>Price: ${schedule.price}</Text>
                            </Center>
                        </GridCol>
                    </Grid>
                </Stack>
            </Card>
        </Box>
    )
}
