"use client"
import Hero from "@/components/Hero/Hero"
import DoctorsList from "@/components/Lists/DoctorsList"
import { useState } from "react"
import { Doctor } from "@/types/doctor"
import Comments from "@/components/Carousels/Comments"
import { Box } from "@mantine/core"

export default function Home() {
    const [results, setResults] = useState<Doctor[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    return (
        <>
            <Hero
                onResults={setResults}
                onLoading={setLoading}
                onError={setError}
            />
            <DoctorsList loading={loading} error={error} Doctors={results} />
            <Box maw={1100} mx='auto' mt={50}>
                <Comments />
            </Box>
        </>
    )
}
