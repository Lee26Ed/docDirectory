import {
    Center,
    Container,
    Flex,
    Grid,
    Group,
    Paper,
    Skeleton,
} from "@mantine/core"
import { StatsGrid } from "./StatsGrid"
import { StatsSegments } from "./StatsSegments"
import ScheduleViewer from "../Scheds/ViewSchedule"
import { StatsRing } from "./StatsRing"

const child = <Skeleton height={140} radius='md' animate={false} />

interface DashboardProps {
    setActive: (active: string) => void
}

export default function Dashboard({ setActive }: DashboardProps) {
    return (
        <Container my='md' size={"xl"}>
            <Flex justify='center' align='center' h='70vh'>
                <Grid>
                    <Grid.Col span={{ base: 12, xs: 12 }}>
                        <StatsGrid />
                    </Grid.Col>
                    <Grid.Col
                        span={{ base: 12, xs: 6 }}
                        onClick={() => setActive("My Information")}
                        style={{ cursor: "pointer" }}
                    >
                        <ScheduleViewer />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 6 }}>
                        <StatsSegments />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, xs: 12 }}>
                        <StatsRing />
                    </Grid.Col>
                </Grid>
            </Flex>
        </Container>
    )
}
