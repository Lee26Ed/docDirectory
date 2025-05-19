import { Container, Grid, Group, Paper, Skeleton } from "@mantine/core"
import { StatsGrid } from "./StatsGrid"
import { StatsSegments } from "./StatsSegments"
import ScheduleViewer from "../Scheds/ViewSchedule"

const child = <Skeleton height={140} radius='md' animate={false} />

interface DashboardProps {
    setActive: (active: string) => void
}

export default function Dashboard({ setActive }: DashboardProps) {
    return (
        <Container my='md'>
            <Grid>
                <Grid.Col span={{ base: 12, xs: 12 }}>
                    <StatsGrid />
                </Grid.Col>
                <Grid.Col
                    span={{ base: 12, xs: 6 }}
                    onClick={() => setActive("Schedule")}
                    style={{ cursor: "pointer" }}
                >
                    <ScheduleViewer />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6 }}>
                    <StatsSegments />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 4 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 3 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 3 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6 }}>{child}</Grid.Col>
            </Grid>
        </Container>
    )
}
