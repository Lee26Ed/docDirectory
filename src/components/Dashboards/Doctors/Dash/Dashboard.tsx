import { Container, Grid, Skeleton } from "@mantine/core"
import { StatsGrid } from "./StatsGrid"
import { StatsSegments } from "./StatsSegments"
import { StatsControls } from "./StatsControls"

const child = <Skeleton height={140} radius='md' animate={false} />

export default function Dashboard() {
    return (
        <Container my='md'>
            <Grid>
                <Grid.Col span={{ base: 12, xs: 12 }}>
                    <StatsGrid />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6 }}>
                    <StatsSegments />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6 }}>
                    <StatsControls />
                </Grid.Col>
                <Grid.Col span={{ base: 12, xs: 4 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 3 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 3 }}>{child}</Grid.Col>
                <Grid.Col span={{ base: 12, xs: 6 }}>{child}</Grid.Col>
            </Grid>
        </Container>
    )
}
