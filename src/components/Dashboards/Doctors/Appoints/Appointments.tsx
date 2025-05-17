"use client"
import React from "react"
import Tables from "./Tables"
import { Center, Container, Title } from "@mantine/core"

const Appointments = () => {
    return (
        <Container mt={50}>
            <Title order={2} mb={20}>
                Appointments
            </Title>
            <Tables />
        </Container>
    )
}

export default Appointments
