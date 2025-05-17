"use client"
import { useState, useEffect } from "react"
import { useDebouncedValue } from "@mantine/hooks"
import { TextInput, Text, Loader } from "@mantine/core"
import { Doctor } from "@/types/doctor"

type Props = {
    onResults: (results: Doctor[]) => void
    onLoading?: (loading: boolean) => void
    onError?: (error: string) => void
}

const SearchInput = ({ onResults, onLoading, onError }: Props) => {
    const [value, setValue] = useState("")
    const [debounced] = useDebouncedValue(value, 200)

    const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL // Define this in your .env file

    useEffect(() => {
        const fetchDoctors = async () => {
            if (debounced.trim() === "") {
                onResults([])
                return
            }

            onLoading?.(true)
            onError?.("")

            try {
                const response = await fetch(
                    `${BACKEND_API_URL}/api/v1/doctors?search=${encodeURIComponent(
                        debounced
                    )}`
                )
                if (!response.ok) throw new Error("Failed to fetch doctors")

                const data = await response.json()
                onResults(data)
            } catch (err: any) {
                onError?.(err.message)
            } finally {
                onLoading?.(false)
            }
        }

        fetchDoctors()
    }, [debounced])

    return (
        <>
            <TextInput
                placeholder='Search healthcare professionals by Name, Location or Speciality...'
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
            />
        </>
    )
}

export default SearchInput
