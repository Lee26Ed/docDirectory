"use client"

import {
    Box,
    Card,
    Group,
    Stack,
    Text,
    Title,
    Badge,
    Divider,
    Center,
    Grid,
    ThemeIcon,
} from "@mantine/core"
import { IconClock, IconMoneybag, IconCalendarTime } from "@tabler/icons-react"

const daysMap = [
    { short: "S", value: "sunday" },
    { short: "M", value: "monday" },
    { short: "T", value: "tuesday" },
    { short: "W", value: "wednesday" },
    { short: "T", value: "thursday" },
    { short: "F", value: "friday" },
    { short: "S", value: "saturday" },
]

type ScheduleProps = {
    workingDays: string[]
    fromTime: string
    toTime: string
    interval: string
    downtime: number
    price: number
}

export default function ScheduleViewer({
    workingDays,
    fromTime,
    toTime,
    interval,
    downtime,
    price,
}: ScheduleProps) {
    return (
        <Box maw={500} mx='auto' mt='xl'>
            <Title order={3} mb='md'>
                Your Schedule
            </Title>

            <Card shadow='sm' padding='lg' radius='md' withBorder>
                <Stack gap='md'>
                    <div>
                        <Text fw={500} size='sm' mb='xs'>
                            Working Days
                        </Text>
                        <Group gap='sm'>
                            {daysMap.map((day, index) => {
                                const isSelected = workingDays.includes(
                                    day.value
                                )
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
                                <Text size='sm'>From: {fromTime}</Text>
                            </Center>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Center inline>
                                <ThemeIcon variant='light' color='blue' mr='xs'>
                                    <IconClock size={16} />
                                </ThemeIcon>
                                <Text size='sm'>To: {toTime}</Text>
                            </Center>
                        </Grid.Col>
                    </Grid>

                    <Grid>
                        <Grid.Col span={6}>
                            <Center inline>
                                <ThemeIcon variant='light' color='teal' mr='xs'>
                                    <IconCalendarTime size={16} />
                                </ThemeIcon>
                                <Text size='sm'>Interval: {interval} min</Text>
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
                                <Text size='sm'>Downtime: {downtime} min</Text>
                            </Center>
                        </Grid.Col>
                    </Grid>

                    <Center inline>
                        <ThemeIcon variant='light' color='green' mr='xs'>
                            <IconMoneybag size={16} />
                        </ThemeIcon>
                        <Text size='sm'>Price: ${price.toFixed(2)}</Text>
                    </Center>
                </Stack>
            </Card>
        </Box>
    )
}
